import { ActivatedRoute } from '@angular/router';
import { Pagination } from './../types/pagination';
import { Component, OnInit } from '@angular/core';
import { OfferService } from '../services/offer.service';
import { OfferToListDto } from '../dtos/offers/offerToListDto';
import { OFFER_PERIOD } from '../types/offer/offerPeriod';
import { OFFER_ENTRY_LEVEL } from '../types/offer/offerEntryLevel';
import { ResolverPagination } from '../types/resolvedPagination';
import { LocalStorageService } from '../services/local-storage.service';
import { OfferListPayloadDto } from '../dtos/offers/offerListPayloadDto';

@Component({
  selector: 'app-search-offers',
  templateUrl: './search-offers.component.html',
  styleUrls: ['./search-offers.component.scss'],
})
export class SearchOffersComponent implements OnInit {
  private static readonly OFFER_LS_PREFIX = 'offer_list_';

  pagination: Pagination = {
    itemsPerPage: 2,
    currentPage: 0,
  };

  numberOfTotalRecords: number = 10;

  rowsPerPageOptions: Array<number> = [2, 5, 10];

  selectedPeriod!: OFFER_PERIOD;

  selectedEntryLevel!: OFFER_ENTRY_LEVEL;

  tags: Array<string> = [];

  offersToDisplay: Array<OfferToListDto> = [];

  periods: Array<{ name: OFFER_PERIOD; label: string }> = [
    { name: OFFER_PERIOD.ANY, label: 'Any' },
    { name: OFFER_PERIOD.THIS_DAY, label: 'This day' },
    { name: OFFER_PERIOD.THIS_WEEK, label: 'This week' },
    { name: OFFER_PERIOD.THIS_MONTH, label: 'This month' },
    { name: OFFER_PERIOD.THIS_YEAR, label: 'This year' },
  ];

  levels: Array<{ name: OFFER_ENTRY_LEVEL; label: string }> = [
    { name: OFFER_ENTRY_LEVEL.ANY, label: 'Any' },
    { name: OFFER_ENTRY_LEVEL.INTERN, label: 'Intern' },
    { name: OFFER_ENTRY_LEVEL.JUNIOR, label: 'Junior' },
    { name: OFFER_ENTRY_LEVEL.MID, label: 'Mid' },
    { name: OFFER_ENTRY_LEVEL.SENIOR, label: 'Senior' },
    { name: OFFER_ENTRY_LEVEL.EXPERT, label: 'Expert' },
  ];

  salaryRange: Array<number> = [20, 50];

  finalMinSalary: number = 0;
  finalMaxSalary: number = 100;

  constructor(
    private readonly offerServ: OfferService,
    private readonly route: ActivatedRoute,
    private readonly lsServ: LocalStorageService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((response: any) => {
      this.numberOfTotalRecords = response.offerWithLength.numberOfTotalRecords;
      this.offersToDisplay = response.offerWithLength.offers;
      this.finalMaxSalary = response.offerWithLength.finalMaxSalary;
      this.finalMinSalary = response.offerWithLength.finalMinSalary;
      this.calculateBasicSalaryRange();
    });
  }

  checkIfCanBeAdded($event: Event): void {
    if (this.tags.length >= 5) {
      this.tags.splice(5);
    }
  }

  searchForOffers(): void {
    this.offerServ
      .getOfferList(
        this.tags,
        this.salaryRange,
        this.selectedPeriod,
        this.selectedEntryLevel
      )
      .subscribe((response: OfferListPayloadDto) => {
        this.numberOfTotalRecords = response.numberOfTotalRecords;
        this.offersToDisplay = response.offers;
        this.finalMaxSalary = response.finalMaxSalary;
        this.finalMinSalary = response.finalMinSalary;
        this.calculateBasicSalaryRange();
      });
  }

  pageChanged(resolverPagination: ResolverPagination): void {
    this.pagination = this.parseResolvedPagination(resolverPagination);

    this.lsServ.setPagination(
      SearchOffersComponent.OFFER_LS_PREFIX,
      this.pagination
    );

    this.offerServ
      .getOfferList(
        this.tags,
        this.salaryRange,
        this.selectedPeriod,
        this.selectedEntryLevel,
        String(this.pagination.itemsPerPage),
        String(this.pagination.currentPage)
      )
      .subscribe((response: any) => {
        this.offersToDisplay = response.offers;
        this.numberOfTotalRecords = response.numberOfTotalRecords;
      });
  }

  private parseResolvedPagination(
    resolvedPagination: ResolverPagination
  ): Pagination {
    const itemsPerPage = resolvedPagination.rows;
    const currentPage = resolvedPagination.page;
    return {
      itemsPerPage,
      currentPage,
    };
  }

  calculateBasicSalaryRange(): void {
    this.salaryRange[0] = this.finalMinSalary;
    this.salaryRange[1] = this.finalMaxSalary;
  }
}
