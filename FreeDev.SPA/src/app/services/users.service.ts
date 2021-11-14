import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { UserToUpdateDto } from '../dtos/userToUpdateDto';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private readonly http: HttpClient) {}

  updateUserInfo(userToUpdateDto: UserToUpdateDto): Observable<boolean> {
    return this.http.put<boolean>(this.getRestUrl() + 'users', userToUpdateDto);
  }

  private getRestUrl(): string {
    return env.backendUrl;
  }
}
