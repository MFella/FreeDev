import { Pagination } from './../types/pagination';
import { LocalStorageService } from './../services/local-storage.service';
import { NotyService } from './../services/noty.service';
import { HttpErrorResponse } from '@angular/common/http';
import { OfferService } from '../services/offer.service';
import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { SavedOffer } from '../types/offer/savedOffer';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SavedOffersResolver implements Resolve<Array<SavedOffer>> {
  private static readonly SAVED_OFFERS_PREFIX: string = 'saved_offers_';

  constructor(
    private readonly offerServ: OfferService,
    private readonly noty: NotyService,
    private readonly lsServ: LocalStorageService
  ) {}

  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<Array<SavedOffer>> {
    const pagination: Pagination = this.lsServ.getPagination(
      SavedOffersResolver.SAVED_OFFERS_PREFIX
    );

    return this.offerServ
      .getSavedOffers(
        pagination?.itemsPerPage.toString() ?? 2,
        pagination?.currentPage.toString() ?? 0
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.noty.error('Cant fetch data');
          return throwError(error);
        })
      );
  }
}
