import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageToSendDto } from '../types/message/messageToSendDto';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponseHandler } from '../common/handlers/httpErrorResponseHandler';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  constructor(
    private readonly http: HttpClient,
    private readonly httpErrorResponseHandler: HttpErrorResponseHandler
  ) {}

  getUserMessages(): Observable<any> {
    return this.http.get<any>(this.getRestUrl());
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

  getRestUrl(): string {
    return environment.backendUrl + 'message';
  }
}
