import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { OfferToCreateDto } from 'src/dtos/offerToCreateDto';
import { OfferService } from './offer.service';

@Controller('offer')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  async createOffer(
    @Req() request,
    @Body() offerToCreateDto: OfferToCreateDto,
  ): Promise<boolean> {
    return await this.offerService.createOffer(offerToCreateDto, request?.user);
  }
}
