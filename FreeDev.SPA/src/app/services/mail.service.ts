import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DirectMessageToSendDto } from '../types/message/directMessageToSendDto';
import { IndirectMessageToSendDto } from '../types/message/indirectMessageToSendDto';
import { FolderType } from '../types/mail/folderType';
import { FolderMessageDto } from '../dtos/notes/folderMessageDto';
import { MailMessageContentDto } from '../types/mail/mailMessageContentDto';
import { FoldersStructure } from '../types/mail/foldersStructure';

@Injectable()
export class MailService {
  constructor(private readonly http: HttpClient) {}

  sendDirectMailMessage(
    directMessageToSendDto: DirectMessageToSendDto
  ): Observable<boolean> {
    return this.http.post<boolean>(
      this.getRestUrl() + 'direct',
      directMessageToSendDto
    );
  }

  sendIndirectMailMessage(
    indirectMessageToSendDto: IndirectMessageToSendDto
  ): Observable<boolean> {
    return this.http.post<boolean>(
      this.getRestUrl() + 'indirect',
      indirectMessageToSendDto
    );
  }

  getMessageContent(messageId: string): Observable<MailMessageContentDto> {
    return this.http.get<MailMessageContentDto>(
      this.getRestUrl() + `content?messageId=${messageId}`
    );
  }

  getFolderMessageList(
    folderType: FolderType
  ): Observable<Array<FolderMessageDto>> {
    return this.http.get<Array<FolderMessageDto>>(
      `${this.getRestUrl()}folder?folderType=${folderType.toLocaleLowerCase()}`
    );
  }

  changeMessageReadStatus(messageId: string): Observable<boolean> {
    return this.http.put<boolean>(`${this.getRestUrl()}content`, { messageId });
  }

  loadFoldersStructure(receiverId: string): Observable<FoldersStructure> {
    return this.http.get<FoldersStructure>(
      `${this.getRestUrl()}structure?receiverId=${receiverId}`
    );
  }

  getRestUrl(): string {
    return environment.backendUrl + 'mail/';
  }
}
