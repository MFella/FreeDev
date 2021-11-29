import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { environment as env } from '../../environments/environment';
import { MessageResponseDto } from '../dtos/messages/messageResponseDto';
import { MessageToCreateDto } from '../dtos/messages/messageToCreateDto';

@Injectable({
  providedIn: 'root',
})
export class WsService {
  private socket!: any;

  constructor() {
    this.socket = io(env.socketBackUrl);
  }

  connectWithAuthSocket(authToken: string): void {
    this.socket = io(env.socketBackUrl, {
      query: { authorization: `Bearer ${authToken}` },
    });
  }

  joinRoom(smth: string): void {
    this.socket.emit('joinRoom', smth);
  }

  onlyJoin(_id: string): void {
    this.socket.emit('onlyJoin', { _id });
  }

  sendPrivateMessage(messageToCreateDto: MessageToCreateDto): void {
    this.socket.emit('privateMessage', messageToCreateDto);
  }

  observePrivateMessage(): Observable<MessageResponseDto> {
    return Observable.create((observer: any) => {
      this.socket.on('privateResponse', (message: MessageResponseDto) => {
        observer.next(message);
      });
    });
  }
}
