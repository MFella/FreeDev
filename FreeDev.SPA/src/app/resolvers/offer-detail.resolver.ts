import { OfferService } from './../services/offer.service';
import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NotyService } from '../services/noty.service';

@Injectable({
  providedIn: 'root',
})
export class OfferDetailResolver implements Resolve<boolean> {
  constructor(
    private readonly offerServ: OfferService,
    private readonly router: Router,
    private readonly noty: NotyService
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.offerServ.getOfferDetail(route.params['id']).pipe(
      catchError((error: HttpErrorResponse) => {
        this.noty.error(error.error.message);
        this.router.navigate(['search-offers']);
        return throwError(error);
      })
    );
  }
}
