import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageToSendDto } from '../types/message/messageToSendDto';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  constructor(private readonly http: HttpClient) {}

  getUserMessages(): Observable<any> {
    return this.http.get<any>(this.getRestUrl());
  }

  sendMessageToUser(messageToSendDto: MessageToSendDto): Observable<boolean> {
    return this.http.post<boolean>(this.getRestUrl(), messageToSendDto);
  }

  getRestUrl(): string {
    return 'message';
  }
}
