import { NotyService } from './../services/noty.service';
import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { MailService } from '../services/mail.service';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { FoldersStructure } from '../types/mail/foldersStructure';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class FolderStructureResolver implements Resolve<FoldersStructure> {
  constructor(
    private readonly mailService: MailService,
    private readonly notyService: NotyService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}
  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<FoldersStructure> {
    return this.mailService
      .loadFoldersStructure(this.authService.getStoredUser()?._id)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.notyService.error(error.error.message);
          this.router.navigate(['']);
          return throwError(error);
        })
      );
  }
}
