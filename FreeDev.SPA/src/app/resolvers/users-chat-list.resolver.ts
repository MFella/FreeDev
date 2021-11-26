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
import { UserToMessageListDto } from '../dtos/users/userToMessageListDto';
import { NotyService } from '../services/noty.service';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root',
})
export class UsersChatListResolver
  implements Resolve<Array<UserToMessageListDto>>
{
  constructor(
    private readonly usersServ: UsersService,
    private readonly noty: NotyService
  ) {}
  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<Array<UserToMessageListDto>> {
    return this.usersServ.getUserList(1, 4).pipe(
      catchError((error: HttpErrorResponse) => {
        this.noty.error('Error occured during fetching users chat list');
        console.log(error);
        return throwError(error);
      })
    );
  }
}
