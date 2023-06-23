import { Pagination } from './../types/pagination';
import { Injectable } from '@angular/core';
import { LocalStorageBaseService } from './local-storage-base.service';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService extends LocalStorageBaseService {
  private static readonly USER_CREDENTIAL_FIELDS: Array<string> = [
    'user',
    'token',
    'expiration',
  ];

  constructor() {
    super();
  }

  setAuthCredentials(authCredentials: [string, string, string]): void {
    LocalStorageService.USER_CREDENTIAL_FIELDS.forEach(
      (key: string, index: number) =>
        localStorage.setItem(key, authCredentials[index])
    );
  }

  removeAuthCredentials(): void {
    LocalStorageService.USER_CREDENTIAL_FIELDS.forEach((key: string) => {
      localStorage.removeItem(key);
    });
  }

  getToken(): string | null {
    return localStorage.getItem(LocalStorageKeyNames.TOKEN);
  }

  getUser(): any {
    const userFromLS = localStorage?.getItem(LocalStorageKeyNames.USER);
    if (!userFromLS) return null;
    return JSON.parse(userFromLS ?? '');
  }

  setPagination(prefix_key: string, pagination: Pagination): void {
    localStorage.setItem(
      prefix_key + LocalStorageKeyNames.PAGINATION,
      JSON.stringify(pagination)
    );
  }

  getPagination(prefix_key: string): Pagination {
    const itemFromStorage =
      localStorage.getItem(prefix_key + LocalStorageKeyNames.PAGINATION) ??
      JSON.stringify({
        itemsPerPage: 2,
        currentPage: 0,
      });
    return JSON.parse(itemFromStorage);
  }

  setMessagesSelectedUserId(prefix_key: string, selectedUserId: string): void {
    localStorage.setItem(
      prefix_key + LocalStorageKeyNames.MESSAGES_SELECTED_USER_ID,
      selectedUserId
    );
  }

  getMessagesSelectedUserId(prefix_key: string): string {
    return (
      localStorage.getItem(
        prefix_key + LocalStorageKeyNames.MESSAGES_SELECTED_USER_ID
      ) ?? ''
    );
  }

  removeMessagesSelectedUserId(prefix_key: string): void {
    localStorage.removeItem(
      prefix_key + LocalStorageKeyNames.MESSAGES_SELECTED_USER_ID
    );
  }
}

enum LocalStorageKeyNames {
  PAGINATION = 'pagination',
  USER = 'user',
  TOKEN = 'token',
  MESSAGES_SELECTED_USER_ID = 'messages-selected-user-id',
}
