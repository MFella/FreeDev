import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';
import { SignedFileUrlDto } from '../dtos/signedFileUrlDto';
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
  ): Observable<Array<UserToMessageListDto>> {
    return this.http.get<Array<UserToMessageListDto>>(
      this.getRestUrl() + `users/users-list?pageNo=${pageNo}&perPage=${perPage}`
    );
  }

  private getRestUrl(): string {
    return env.backendUrl;
  }
}
