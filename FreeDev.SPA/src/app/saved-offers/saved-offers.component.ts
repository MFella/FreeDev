import { OfferService } from './../services/offer.service';
import { LocalStorageService } from './../services/local-storage.service';
import { Pagination } from './../types/pagination';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ResolverPagination } from '../types/resolvedPagination';
import { SavedOffer } from '../types/offer/savedOffer';
import { PaginationResolver } from '../utils/paginationResolver';
import { SavedOffersResponseDto } from '../dtos/offers/savedOffersResponseDto';

@Component({
  selector: 'app-saved-offers',
  templateUrl: './saved-offers.component.html',
  styleUrls: ['./saved-offers.component.scss'],
})
export class SavedOffersComponent implements OnInit {
  private static readonly SAVED_OFFERS_PREFIX: string = 'saved_offers_';

  pagination: Pagination = { itemsPerPage: 2, currentPage: 0 };

  numberOfTotalRecords = 10;

  rowsPerPageOptions = [2, 5, 10];

  savedOffers: Array<SavedOffer> = [];

  dateRange: Array<Date> | undefined;

  searchPhrase: string = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly lsServ: LocalStorageService,
    private readonly offerServ: OfferService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((response: any) => {
      this.savedOffers = response.offers.onlyOffers;
      this.numberOfTotalRecords = response.offers.numberOfTotalRecords;
    });
  }

  pageChanged(resolverPagination: ResolverPagination): void {
    this.pagination =
      PaginationResolver.parseResolvedPagination(resolverPagination);
    this.lsServ.setPagination(
      SavedOffersComponent.SAVED_OFFERS_PREFIX,
      this.pagination
    );

    this.offerServ
      .getSavedOffers(
        '',
        [],
        this.pagination.itemsPerPage.toString(),
        this.pagination.currentPage.toString()
      )
      .subscribe((response: SavedOffersResponseDto) => {
        this.savedOffers = response.onlyOffers;
        this.numberOfTotalRecords = response.numberOfTotalRecords;
      });
  }

  onDateClickOutside(): void {}

  searchSavedOffers(): void {
    this.offerServ
      .getSavedOffers(
        this.searchPhrase,
        this.dateRange,
        this.pagination.itemsPerPage.toString(),
        this.pagination.currentPage.toString()
      )
      .subscribe((response: SavedOffersResponseDto) => {
        this.savedOffers = response.onlyOffers;
        this.numberOfTotalRecords = response.numberOfTotalRecords;
      });
  }
}
