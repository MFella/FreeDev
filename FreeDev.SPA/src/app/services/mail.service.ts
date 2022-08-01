import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DirectMessageToSendDto} from "../types/message/directMessageToSendDto";
import {IndirectMessageToSendDto} from "../types/message/indirectMessageToSendDto";
import {FolderType} from "../types/contacts/folderType";
import {take} from "rxjs/operators";
import {FolderMessageDto} from "../dtos/notes/folderMessageDto";

@Injectable()
export class MailService {

  constructor(
    private readonly http: HttpClient
  ) {
  }

  sendDirectMailMessage(directMessageToSendDto: DirectMessageToSendDto): Observable<boolean> {
    return this.http.post<boolean>(this.getRestUrl() + 'direct', directMessageToSendDto);
  }

  sendIndirectMailMessage(indirectMessageToSendDto: IndirectMessageToSendDto): Observable<boolean> {
    return this.http.post<boolean>(this.getRestUrl() + 'indirect', indirectMessageToSendDto);
  }

  getMessageContent(messageId: string): Observable<string> {
    return this.http.get<string>(this.getRestUrl() + `content?messageId=${messageId}`);
  }

  getFolderMessageList(folderType: FolderType): Observable<Array<FolderMessageDto>> {
    return this.http
      .get<Array<FolderMessageDto>>(
        `${this.getRestUrl()}folder?folderType=${folderType.toLocaleLowerCase()}`
      );
  }

  getRestUrl(): string {
    return environment.backendUrl + 'mail/';
  }
}
