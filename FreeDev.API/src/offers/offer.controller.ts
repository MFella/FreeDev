import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OfferToCreateDto } from 'src/dtos/offerToCreateDto';
import { OfferService } from './offer.service';
import { PaginationWithFiltersQuery } from 'src/types/paginationWithFiltersQuery';

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

  @UseGuards(JwtAuthGuard)
  @Get('details')
  async getOfferDetails(@Query() query: { id: string }): Promise<any> {
    return this.offerService.getOfferDetails(query.id?.toString());
  }

  @UseGuards(JwtAuthGuard)
  @Get('list')
  async getOfferList(
    @Query() pagination: PaginationWithFiltersQuery,
  ): Promise<any> {
    return this.offerService.getOfferList(pagination);
  }

  @UseGuards(JwtAuthGuard)
  @Put('save')
  @HttpCode(204)
  async saveOffer(
    @Query() query: { offerId: string },
    @Req() request,
  ): Promise<any> {
    return this.offerService.addOfferToFavourites(
      request.user.userId,
      query.offerId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('submit-proposal')
  @HttpCode(204)
  async submitProposal(
    @Query() query: { offerId: string },
    @Req() request,
  ): Promise<any> {
    return this.offerService.submitProposal(request.user.userId, query.offerId);
  }
}
