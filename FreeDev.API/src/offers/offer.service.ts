import { PaginationWithFiltersQuery } from '../types/paginationWithFiltersQuery';
import { StoredUser } from './../types/storedUser.interface';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { OfferToCreateDto } from 'src/dtos/offerToCreateDto';
import { Offer, OfferDocument } from './offer.schema';
import { Roles } from 'src/types/roles';
import { OfferResolver } from 'src/utils/offer/offerResolver';
import { Developer, DeveloperDocument } from 'src/users/developer.schema';
import { createAwait } from 'typescript';

export class OfferService {
  constructor(
    @InjectModel(Offer.name) private readonly offerModel: Model<OfferDocument>,
    @InjectModel(Developer.name)
    private developerModel: Model<DeveloperDocument>,
  ) {}

  async createOffer(
    offerToCreateDto: OfferToCreateDto,
    loggedUser: StoredUser,
  ): Promise<boolean> {
    try {
      // that one should be handled via RolesGuard
      if (loggedUser.role !== Roles.HUNTER) {
        throw new ForbiddenException('You cant create offers');
      }

      const result = await this.offerModel.create({
        createdAt: new Date(),
        createdBy: loggedUser.userId,
        ...offerToCreateDto,
      });
      return !!result;
    } catch (e) {
      throw new InternalServerErrorException(
        'Error occured during saving offer',
      );
    }
  }

  async getOfferList(query: PaginationWithFiltersQuery): Promise<any> {
    try {
      const selectedFields = {
        _id: 1,
        title: 1,
        description: 1,
        tags: 1,
        createdAt: 1,
      };
      let arrayOfTags: Array<string> = [];
      if (query.tags.length === 1 && query.tags[0] === '') {
        arrayOfTags = [];
      } else {
        arrayOfTags = (<unknown>(
          query.tags.map((tag: string) => new RegExp(`^${tag}$`, 'i'))
        )) as Array<string>;
      }

      const resolvedPeriods: Array<Date> = OfferResolver.convertPeriodToDate(
        query.period,
      );

      const resolvedSalary: Array<number> = OfferResolver.convertSalaryToNumber(
        query.salaryRange,
      );

      const arrayOfTagsCondition = !arrayOfTags.length
        ? { $exists: true }
        : { $in: arrayOfTags };

      const periodsCondition: any = !resolvedPeriods.length
        ? { $exists: true }
        : { $gt: resolvedPeriods[0], $lt: resolvedPeriods[1] };

      const salaryCondition: any = !resolvedSalary.length
        ? { $exists: true }
        : {
            $gte: Math.min(...resolvedSalary),
            $lte: Math.max(...resolvedSalary),
          };

      const offersToReturn = await this.offerModel
        .find({
          tags: arrayOfTagsCondition,
          createdAt: periodsCondition,
          salary: salaryCondition,
        })
        .select(selectedFields)
        .skip(Number(query.currentPage) * Number(query.itemsPerPage))
        .limit(Number(query.itemsPerPage));

      const numberOfTotalRecords = await this.offerModel
        .find({
          tags: arrayOfTagsCondition,
          createdAt: periodsCondition,
          salary: salaryCondition,
        })
        .count();

      const minSalary = await this.offerModel
        .find({})
        .select({ salary: 1 })
        .sort({ salary: 1 })
        .limit(1);

      const maxSalary = await this.offerModel
        .find({})
        .select({ salary: 1 })
        .sort({ salary: -1 })
        .limit(1);

      const finalMinSalary = minSalary.length === 1 ? minSalary[0].salary : 0;
      const finalMaxSalary = maxSalary.length === 1 ? maxSalary[0].salary : 100;

      return {
        offers: offersToReturn,
        numberOfTotalRecords,
        finalMinSalary,
        finalMaxSalary,
      };
    } catch (e: any) {
      throw new InternalServerErrorException(
        'Error occured during retriving data',
      );
    }
  }

  async getOfferDetails(offerId: string, userId: string): Promise<any> {
    if (!offerId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Provided id is not valid');
    }
    try {
      let isUserAppliedForOffer: boolean = false;
      let isUserSavedOffer: boolean = false;
      const userFromRepo = await this.developerModel.findOne({ _id: userId });

      if (!Object.values(userFromRepo).length) {
        throw new UnauthorizedException('You shall not pass');
      }

      isUserSavedOffer = userFromRepo.favouriteOffers
        .map((offerId: any) => offerId.toString())
        .includes(offerId);

      const offerFromRepo = await this.offerModel
        .findOne({
          _id: offerId.toString(),
        })
        .populate('createdBy', { name: 1, surname: 1, nameOfCompany: 1 });

      if (!Object.values(offerFromRepo).length) {
        throw new NotFoundException('Offer with that id doesnt exists');
      }

      isUserAppliedForOffer = offerFromRepo.appliedDevelopers
        .map((objectId: unknown) => objectId.toString())
        .includes(userId.toString());

      return {
        offerContent: offerFromRepo,
        isUserAppliedForOffer,
        isUserSavedOffer,
      };
    } catch (e: any) {
      throw new InternalServerErrorException(
        'Error occured during retriving data.',
      );
    }
  }

  async addOfferToFavourites(userId: string, offerId: any): Promise<any> {
    try {
      const userFromDb = await this.developerModel.findById(userId);
      if (!Object.values(userFromDb)) {
        throw new NotFoundException('User with that id doesnt exists');
      }

      await this.developerModel.findByIdAndUpdate(userId, {
        favouriteOffers: [...new Set([offerId, ...userFromDb.favouriteOffers])],
      });

      return;
    } catch (e: unknown) {
      throw new InternalServerErrorException(
        'Error occured during saving data.',
      );
    }
  }

  async submitProposal(userId: any, offerId: string): Promise<any> {
    const offerFromDb = await this.offerModel.findById(offerId);
    if (!Object.values(offerFromDb)) {
      throw new NotFoundException('User with that id doesnt exists');
    }

    try {
      await this.offerModel.findByIdAndUpdate(offerId, {
        appliedDevelopers: [
          ...new Set([userId, ...offerFromDb.appliedDevelopers]),
        ],
      });
      return;
    } catch (e: unknown) {
      throw new InternalServerErrorException(
        'Error occured during saving data.',
      );
    }
  }

  async getSavedOffers(
    userId: string,
    itemsPerPage: string,
    currentPage: string,
    dateRange: Array<string>,
    searchPhrase: string,
  ): Promise<any> {
    const propsToTake = { createdAt: 1, title: 1, tags: 1 };
    const trueDateRange = dateRange.map((date: string) => new Date(date));
    const maxDate: Date = trueDateRange.reduce((a, b) => (a > b ? a : b));
    const minDate: Date = trueDateRange.reduce((a, b) => (a < b ? a : b));

    const dateCondition =
      !dateRange.length || dateRange.length !== 3
        ? { $exists: true }
        : { $gte: minDate, $lte: maxDate };

    const titleCondition = !searchPhrase.length
      ? { $exists: true }
      : new RegExp(`^${searchPhrase}`, 'i');

    const userFromDb = await this.developerModel.findById(userId).populate({
      path: 'favouriteOffers',
      match: { createdAt: dateCondition, title: titleCondition },
      select: propsToTake,
      skip: Number(currentPage) * Number(itemsPerPage),
      limit: Number(itemsPerPage),
    });

    const favouriteOffersCount = (
      await this.developerModel.findById(userId).populate({
        path: 'favouriteOffers',
        match: { createdAt: dateCondition, title: titleCondition },
      })
    ).favouriteOffers.length;

    if (!Object.values(userFromDb).length) {
      throw new UnauthorizedException('User with that id doesnt exists');
    }

    return {
      onlyOffers: userFromDb.favouriteOffers,
      numberOfTotalRecords: favouriteOffersCount,
    };
  }
}
