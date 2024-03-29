import { Pagination } from './../types/pagination';
import { Injectable } from '@angular/core';
import { LocalStorageBaseService } from './local-storage-base.service';
import { FolderType } from '../types/mail/folderType';

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

  setMailSelectedFolder(prefixKey: string, folderName: FolderType): void {
    localStorage.setItem(
      prefixKey + LocalStorageKeyNames.MAIL_SELECTED_FOLDER,
      folderName
    );
  }

  getMailSelectedFolder(prefixKey: string): FolderType | undefined {
    const mailSelectedFolder = localStorage.getItem(
      prefixKey + LocalStorageKeyNames.MAIL_SELECTED_FOLDER
    );

    if (mailSelectedFolder) {
      return mailSelectedFolder as FolderType;
    }

    return;
  }

  getMailFolderPagination(
    selectedFolderType: FolderType
  ): Pagination | undefined {
    const mailFolderPagination = localStorage.getItem(
      LocalStorageKeyNames.MAIL_PAGINATION + '-' + selectedFolderType
    );

    if (mailFolderPagination) {
      return JSON.parse(mailFolderPagination) as Pagination;
    }

    return;
  }

  setMailFolderPagination(
    selectedFolderType: FolderType,
    pagination: Pagination
  ): void {
    localStorage.setItem(
      LocalStorageKeyNames.MAIL_PAGINATION + '-' + selectedFolderType,
      JSON.stringify(pagination)
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
  MAIL_SELECTED_FOLDER = 'mail-selected-folder',
  MAIL_PAGINATION = 'saved-mail-pagination',
}
