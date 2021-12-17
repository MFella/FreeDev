import { PaginationWithFiltersQuery } from '../types/paginationWithFiltersQuery';
import { StoredUser } from './../types/storedUser.interface';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OfferToCreateDto } from 'src/dtos/offerToCreateDto';
import { Offer, OfferDocument } from './offer.schema';
import { Roles } from 'src/types/roles';
import { OfferResolver } from 'src/utils/offer/offerResolver';
import { Developer, DeveloperDocument } from 'src/users/developer.schema';

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

  async getOfferDetails(offerId: string): Promise<any> {
    if (!offerId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Provided id is not valid');
    }
    try {
      const offerFromRepo = await this.offerModel
        .findOne({
          _id: offerId.toString(),
        })
        .populate('createdBy', { name: 1, surname: 1, nameOfCompany: 1 });

      if (!Object.values(offerFromRepo).length) {
        throw new NotFoundException('Offer with that id doesnt exists');
      }

      return offerFromRepo;
    } catch (e: any) {
      throw new InternalServerErrorException(
        'Error occured during retriving data.',
      );
    }
  }

  async addOfferToFavourites(userId: string, offerId: string): Promise<any> {
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

  async submitProposal(userId: string, offerId: string): Promise<any> {
    try {
      const offerFromDb = await this.offerModel.findById(offerId);
      if (!Object.values(offerFromDb)) {
        throw new NotFoundException('User with that id doesnt exists');
      }

      await this.offerModel.findByIdAndUpdate(offerId, {
        favouriteOffers: [
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
}
