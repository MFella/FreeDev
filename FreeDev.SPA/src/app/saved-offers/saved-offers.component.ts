import { Pagination } from './../types/pagination';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ResolverPagination } from '../types/resolvedPagination';
import { SavedOffer } from '../types/offer/savedOffer';

@Component({
  selector: 'app-saved-offers',
  templateUrl: './saved-offers.component.html',
  styleUrls: ['./saved-offers.component.scss'],
})
export class SavedOffersComponent implements OnInit {
  pagination: Pagination = { itemsPerPage: 2, currentPage: 0 };

  numberOfTotalRecords = 10;

  rowsPerPageOptions = [2, 5, 10];

  savedOffers: Array<SavedOffer> = [];

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((response: any) => {
      console.log('response', response);
      this.savedOffers = response.offers.onlyOffers;
    });
  }

  pageChanged(resolverPagination: ResolverPagination): void {
    console.log(resolverPagination);
  }
}
