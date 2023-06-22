import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';
import { SignedFileUrlDto } from '../dtos/signedFileUrlDto';
import { ResolvedMessagePageInfo } from '../dtos/users/resolvedMessagePageInfo';
import { UserToUpdateDto } from '../dtos/users/userToUpdateDto';
import { AuthService } from './auth.service';
import { FilteredUserChatListDto } from '../types/users/filteredUserChatListDto';

export type CountrySelectItem = {
  name: string;
  code: string;
};

export type CountryFilePayload = {
  data: Array<CountrySelectItem>;
};

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private static readonly COUNTRY_LIST_URL: string =
    '/assets/data/countries.json';

  constructor(
    private readonly http: HttpClient,
    private readonly authServ: AuthService
  ) {}

  updateUserInfo(
    userToUpdateDto: UserToUpdateDto,
    idFromParams: string
  ): Observable<SignedFileUrlDto> {
    return this.http.put<SignedFileUrlDto>(
      this.getRestUrl() + `users?id=${idFromParams}`,
      userToUpdateDto
    );
  }

  getUserList(
    pageNo: number,
    perPage: number
  ): Observable<ResolvedMessagePageInfo> {
    return this.http.get<ResolvedMessagePageInfo>(
      this.getRestUrl() + `users/users-list?pageNo=${pageNo}&perPage=${perPage}`
    );
  }

  getFilteredUserList(
    pageNo: number,
    perPage: number,
    name: string = '',
    typeOfUser: string | TypeOfSearchUser = TypeOfSearchUser.BOTH
  ): Observable<FilteredUserChatListDto> {
    return this.http
      .get<FilteredUserChatListDto>(
        this.getRestUrl() +
          `users/filtered-users-list?pageNo=${pageNo}&perPage=${perPage}&name=${name?.trim()}
    &typeOfUser=${typeOfUser}`
      )
      .pipe(
        map((filteredUserList: any) => {
          filteredUserList.result.forEach(
            (filteredUser: any) =>
              (filteredUser.role =
                filteredUser.role.charAt(0).toUpperCase() +
                filteredUser.role.slice(1).toLowerCase())
          );
          return filteredUserList;
        })
      );
  }

  getUserChatKeyRoom(userId: string): Observable<any> {
    return this.http
      .get<any>(this.getRestUrl() + `users/user-key-room?_id=${userId}`)
      .pipe(take(1));
  }

  getSavedMessaged(roomKey: string): Observable<Array<any>> {
    return this.http
      .get<Array<any>>(this.getRestUrl() + `message/all?key=${roomKey}`)
      .pipe(take(1));
  }

  fetchPartialMessages(
    messageNumberFrom: number,
    messageStep: number,
    roomKey: string
  ): Observable<Array<any>> {
    return this.http
      .get<Array<any>>(
        this.getRestUrl() +
          `message/partials?messageFrom=${messageNumberFrom}&messageStep=${messageStep}&roomKey=${roomKey}`
      )
      .pipe(
        take(1),
        map((res: Array<any>) => {
          const newResponse = res.map((element: any) => {
            return {
              message: element.content,
              sendTime: element.sendTime,
              sender: element.sender,
              amIOwner: element.sender === this.authServ.storedUser._id,
            };
          });
          return newResponse.reverse();
        })
      );
  }

  selectCountryList(): Promise<CountryFilePayload> {
    return fetch(UsersService.COUNTRY_LIST_URL).then(async (response) => {
      return await response?.json();
    });
  }

  private getRestUrl(): string {
    return (env as any).backendUrl;
  }
}

export enum TypeOfSearchUser {
  HUNTER = 'HUNTER',
  DEVELOPER = 'DEVELOPER',
  BOTH = 'BOTH',
}
