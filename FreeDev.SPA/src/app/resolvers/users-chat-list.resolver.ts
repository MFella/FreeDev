import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ResolvedMessagePageInfo } from '../dtos/users/resolvedMessagePageInfo';
import { UserToMessageListDto } from '../dtos/users/userToMessageListDto';
import { LocalStorageService } from '../services/local-storage.service';
import { NotyService } from '../services/noty.service';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root',
})
export class UsersChatListResolver implements Resolve<ResolvedMessagePageInfo> {
  private static readonly MESSAGE_LS_PREFIX: string = 'messages_user_list_';
  constructor(
    private readonly usersServ: UsersService,
    private readonly noty: NotyService,
    private readonly lsServ: LocalStorageService
  ) {}
  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<ResolvedMessagePageInfo> {
    const paginationFromStorage = this.lsServ.getPagination(
      UsersChatListResolver.MESSAGE_LS_PREFIX
    );
    return this.usersServ
      .getFilteredUserList(
        paginationFromStorage?.currentPage ?? 1,
        paginationFromStorage?.itemsPerPage ?? 2
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.noty.error('Error occured during fetching users chat list');
          console.log(error);
          return throwError(error);
        })
      );
  }
}
