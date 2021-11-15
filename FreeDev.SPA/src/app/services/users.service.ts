import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';
import { SignedFileUrlDto } from '../dtos/signedFileUrlDto';
import { UserToUpdateDto } from '../dtos/userToUpdateDto';

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

  private getRestUrl(): string {
    return env.backendUrl;
  }
}
