import { Pagination } from './../types/pagination';
import { Injectable } from '@angular/core';
import { AfterLoginInfoDto } from '../dtos/users/afterLoginInfoDto';

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

  setPagination(prefix_key: string, pagination: Pagination): void {
    localStorage.setItem(prefix_key + 'pagination', JSON.stringify(pagination));
  }

  getPagination(prefix_key: string): Pagination {
    const itemFromStorage =
      localStorage.getItem(prefix_key + 'pagination') ??
      JSON.stringify({
        itemsPerPage: 2,
        currentPage: 0,
      });
    return JSON.parse(itemFromStorage);
  }
}
