import { StoredUser } from './../types/storedUser.interface';
import {
  ForbiddenException,
  InternalServerErrorException,
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
}
