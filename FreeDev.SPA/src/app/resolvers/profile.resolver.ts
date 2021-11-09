import { NotyService } from './../services/noty.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { UserToProfileDto } from '../dtos/userToProfileDto';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileResolver implements Resolve<UserToProfileDto> {
  constructor(
    private readonly authServ: AuthService,
    private readonly noty: NotyService,
    private router: Router
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<UserToProfileDto> {
    return this.authServ.getUserProfile(route.queryParams.id).pipe(
      catchError((error: HttpErrorResponse) => {
        this.noty.error(error.error.message);
        this.router.navigate(['']);
        return throwError(error);
      })
    );
  }
}
