import {FolderType} from './../types/contacts/folderType';
import {environment} from './../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MessageToSendDto} from '../types/message/messageToSendDto';
import {catchError, take} from 'rxjs/operators';
import {HttpErrorResponseHandler} from '../common/handlers/httpErrorResponseHandler';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  constructor(
    private readonly http: HttpClient,
    private readonly httpErrorResponseHandler: HttpErrorResponseHandler
  ) {
  }

  sendMessageToUser(messageToSendDto: MessageToSendDto): Observable<boolean> {
    return this.http
      .post<boolean>(this.getRestUrl(), messageToSendDto)
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.httpErrorResponseHandler.handleErrorResponse(error)
        )
      );
  }

  getFolderMessageList(folderType: FolderType): Observable<any> {
    return this.http
      .get<any>(
        `${this.getRestUrl()}/folder?folderType=${folderType.toLocaleLowerCase()}`
      )
      .pipe(take(1));
  }

  getRestUrl(): string {
    return environment.backendUrl + 'message';
  }
}
