import { Roles } from '../types/roles';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OfferToCreateDto } from 'src/dtos/offerToCreateDto';
import { OfferService } from './offer.service';
import { PaginationWithFiltersQuery } from 'src/types/paginationWithFiltersQuery';
import { PaginationQuery } from 'src/types/paginationQuery';

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
  async getOfferDetails(
    @Query() query: { id: string },
    @Req() req,
  ): Promise<any> {
    if (req.user.role === Roles.HUNTER) {
      return await this.offerService.getHunterOfferDetails(
        query.id?.toString(),
        req.user.userId,
      );
    }

    return this.offerService.getOfferDetails(
      query.id?.toString(),
      req.user.userId,
    );
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
    if (request.user.role === Roles.HUNTER) {
      throw new ForbiddenException('You havent got permission to do that');
    }
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
    if (request.user.role === Roles.HUNTER) {
      throw new ForbiddenException('You havent got permission to do that');
    }
    return this.offerService.submitProposal(request.user.userId, query.offerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('saved')
  async getSavedOffers(
    @Query() pagination: PaginationQuery,
    @Req() request,
  ): Promise<any> {
    if (request.user.role === Roles.HUNTER) {
      return await this.offerService.getMyOffers(
        request.user.userId,
        pagination.itemsPerPage,
        pagination.currentPage,
        pagination.date,
        pagination.searchPhrase,
      );
    }

    return await this.offerService.getSavedOffers(
      request.user.userId,
      pagination.itemsPerPage,
      pagination.currentPage,
      pagination.date,
      pagination.searchPhrase,
    );
  }
}
