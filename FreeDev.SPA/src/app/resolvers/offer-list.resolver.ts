import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OfferListPayloadDto } from '../dtos/offers/offerListPayloadDto';
import { OfferService } from '../services/offer.service';

@Injectable({
  providedIn: 'root',
})
export class OfferListResolver implements Resolve<OfferListPayloadDto> {
  constructor(private readonly offerServ: OfferService) {}
  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<OfferListPayloadDto> {
    return this.offerServ.getOfferList().pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }
}
