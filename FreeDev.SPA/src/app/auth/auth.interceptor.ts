import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NotyService } from '../services/noty.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly noty: NotyService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.localStorageService.getToken();
    if (token) {
      const clonedReq = request.clone({
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      });
      return next.handle(clonedReq).pipe(
        catchError((response: HttpErrorResponse) => {
          if (response.status === 401) {
            this.router.navigate(['']);
            this.authService.logout();
            this.noty.error('Session expired - try to log again');
          }

          return throwError(response);
        })
      );
    }

    return next.handle(request);
  }
}
