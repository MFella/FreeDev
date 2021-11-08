import { OfferController } from './offer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Offer, OfferSchema } from './offer.schema';
import { OfferService } from './offer.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Offer.name, schema: OfferSchema }]),
  ],
  providers: [OfferService],
  controllers: [OfferController],
})
export class OfferModule {}
