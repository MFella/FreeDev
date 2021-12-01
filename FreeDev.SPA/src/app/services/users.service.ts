import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';
import { SignedFileUrlDto } from '../dtos/signedFileUrlDto';
import { ResolvedMessagePageInfo } from '../dtos/users/resolvedMessagePageInfo';
import { UserToMessageListDto } from '../dtos/users/userToMessageListDto';
import { UserToUpdateDto } from '../dtos/users/userToUpdateDto';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private readonly http: HttpClient) {}

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

  private getRestUrl(): string {
    return env.backendUrl;
  }
}
