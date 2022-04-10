import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { environment as env } from '../../environments/environment';
import { MessageResponseDto } from '../dtos/messages/messageResponseDto';
import { MessageToCreateDto } from '../dtos/messages/messageToCreateDto';
import { CurrentLoggedUser } from '../types/logged-users/currentLoggedUser';

@Injectable({
  providedIn: 'root',
})
export class WsService {
  private socket!: any;

  constructor() {
    this.socket = io((env as any).socketBackUrl);
  }

  connectWithAuthSocket(authToken: string): void {
    this.socket = io((env as any).socketBackUrl, {
      query: { authorization: `Bearer ${authToken}` },
    });
  }

  joinRoom(smth: string): void {
    this.socket.emit('joinRoom', smth);
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

  observeIncomingCall(): Observable<string> {
    return Observable.create((observer: any) => {
      this.socket.on('callAnswer', (key: string) => {
        observer.next(key);
      });
    });
  }

  joinUserRoom(key: string): void {
    this.socket.emit('joinPrivateRoom', { key });
  }

  startMediaCall(key: string): void {
    this.socket.emit('subscribeIncomingCall', { key });
  }

  observeLoggedInUsers(): Observable<Array<CurrentLoggedUser>> {
    return new Observable((subscriber) => {
      this.socket.on(
        'getLoggedInUsers',
        (payload: Array<CurrentLoggedUser>) => {
          subscriber.next(payload);
        }
      );
    });
  }

  emitVisibleUsersFromList(visibleUsersIds: Array<string>): void {
    this.socket.emit('loggedInUsers', visibleUsersIds);
  }

  emitLogAction(logAction: CurrentLoggedUser): void {
    this.socket.emit('ackLogAction', logAction);
  }
}
