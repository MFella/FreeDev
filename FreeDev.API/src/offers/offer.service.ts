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

export class OfferService {
  constructor(
    @InjectModel(Offer.name) private readonly offerModel: Model<OfferDocument>,
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

      const result = await this.offerModel.create(offerToCreateDto);
      return !!result;
    } catch (e) {
      throw new InternalServerErrorException(
        'Error occured during saving offer',
      );
    }
  }

  async getOfferList(query: PaginationWithFiltersQuery): Promise<any> {
    // try {
    console.log(query.tags);
    const arrayOfTags = (<unknown>(
      query.tags.map((tag: string) => new RegExp(`^${tag}$`, 'i'))
    )) as Array<string>;
    const offersToReturn = await this.offerModel
      .find({
        tags: { $in: arrayOfTags },
      })
      .skip(Number(query.currentPage) * Number(query.itemsPerPage))
      .limit(Number(query.itemsPerPage));

    return offersToReturn;
    //  } catch (e: any) {
    throw new InternalServerErrorException(
      'Error occured during retriving data',
    );
    // }
  }

  async getOfferDetails(offerId: string): Promise<any> {
    if (!offerId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Provided id is not valid');
    }
    try {
      const offerFromRepo = await this.offerModel.findOne({
        _id: offerId.toString(),
      });

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
}
