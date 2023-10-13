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

export type PartialMessage = {
  id: string;
  content: string;
  sendTime: Date;
  sendTimePretty: string;
  sender: string;
  amIOwner: boolean;
  replyMessageContent: string;
  amIReplyMessageOwner: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private static readonly COUNTRY_LIST_URL: string =
    '/assets/data/countries.json';

  // should go to some util-calculator
  private static readonly MS_IN_DAY: number = 1000 * 60 * 60 * 24;

  private static readonly WEEK_DAYS: Array<string> = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

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
  ): Observable<Array<PartialMessage>> {
    return this.http
      .get<Array<PartialMessage>>(
        this.getRestUrl() +
          `message/partials?messageFrom=${messageNumberFrom}&messageStep=${messageStep}&roomKey=${roomKey}`
      )
      .pipe(
        take(1),
        map((res: Array<any>) => {
          return res
            .map((element: any) => {
              return {
                content: element.content,
                id: element?._id,
                sendTime: element.sendTime,
                sendTimePretty: this.getElementSendTimePretty(
                  new Date(element.sendTime)
                ),
                sender: element.sender,
                amIOwner: element.sender === this.authServ.storedUser._id,
                replyMessageContent: element?.replyMessage?.content,
                amIReplyMessageOwner:
                  element?.replyMessage?.sender ===
                  this.authServ.storedUser?._id,
              };
            })
            .reverse();
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

  private getElementSendTimePretty(sendTime: Date): string {
    const todayDate = new Date();
    const todayDateUtc = Date.UTC(
      todayDate.getFullYear(),
      todayDate.getMonth(),
      todayDate.getDate()
    );
    const sendDateUtc = Date.UTC(
      sendTime.getFullYear(),
      sendTime.getMonth(),
      sendTime.getDate()
    );

    const diffInDays: number = Math.floor(
      (todayDateUtc - sendDateUtc) / UsersService.MS_IN_DAY
    );
    const clockFullMinutes =
      (sendTime.getMinutes() < 10 ? '0' : '') + sendTime.getMinutes();
    const fullHour: string = sendTime.getHours() + ':' + clockFullMinutes;

    if (diffInDays === 0) {
      return 'Today, ' + fullHour;
    } else if (diffInDays === 1) {
      return 'Yesterday, ' + fullHour;
    }

    if (diffInDays < 7) {
      return (
        sendTime.toLocaleString('en-us', { weekday: 'long' }) + ', ' + fullHour
      );
    }

    return (
      sendTime.getDate() +
      ' ' +
      sendTime.toLocaleString('en-us', { month: 'short' }) +
      ' ' +
      sendTime.getFullYear() +
      ' ' +
      fullHour
    );
  }
}

export enum TypeOfSearchUser {
  HUNTER = 'HUNTER',
  DEVELOPER = 'DEVELOPER',
  BOTH = 'BOTH',
}
