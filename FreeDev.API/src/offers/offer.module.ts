import { Hunter, HunterSchema } from './../users/hunter.schema';
import { Developer, DeveloperSchema } from './../users/developer.schema';
import { UsersModule } from './../users/users.module';
import { OfferController } from './offer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Offer, OfferSchema } from './offer.schema';
import { OfferService } from './offer.service';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Offer.name, schema: OfferSchema },
      { name: Developer.name, schema: DeveloperSchema },
      { name: Hunter.name, schema: HunterSchema },
    ]),
  ],
  providers: [OfferService],
  controllers: [OfferController],
})
export class OfferModule {}
