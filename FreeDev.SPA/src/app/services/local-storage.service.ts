import { Injectable } from '@angular/core';
import { AfterLoginInfoDto } from '../dtos/afterLoginInfoDto';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private static readonly USER_CREDENTIAL_FIELDS: Array<string> = [
    'user',
    'token',
    'expiration',
  ];

  constructor() {}

  setAuthCredentials(user: string, token: string, expiration: string): void {
    localStorage.setItem('user', user);
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expiration);
  }

  removeAuthCredentials(): void {
    LocalStorageService.USER_CREDENTIAL_FIELDS.forEach((key: string) => {
      localStorage.removeItem(key);
    });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): any {
    const userFromLS = localStorage?.getItem('user');
    if (!userFromLS) return null;
    return JSON.parse(userFromLS ?? '');
  }
}
