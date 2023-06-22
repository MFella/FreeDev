import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { io } from 'socket.io-client';
import { environment as env } from '../../environments/environment';
import { MessageResponseDto } from '../dtos/messages/messageResponseDto';
import { MessageToCreateDto } from '../dtos/messages/messageToCreateDto';
import { CurrentLoggedUser } from '../types/logged-users/currentLoggedUser';
import { CancellationCallMessage } from '../types/call/cancellationCallMessage';
import { IncomingCallAnswer } from '../types/call/incomingCallAnswer';

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
    return new Observable((observer: any) => {
      this.socket.on('privateResponse', (message: MessageResponseDto) => {
        observer.next(message);
      });
    });
  }

  observeIncomingCall(): Observable<IncomingCallAnswer> {
    return new Observable((observer: Observer<IncomingCallAnswer>) => {
      this.socket.on('callAnswer', (key: IncomingCallAnswer) => {
        observer.next(key);
      });
    });
  }

  sendCancellationOfCall(sourceUserId: string, targetUserId: string): void {
    this.socket.emit('cancelCall', { sourceUserId, targetUserId });
  }

  observeCancellationOfCall(): Observable<CancellationCallMessage> {
    return new Observable((observer: Observer<CancellationCallMessage>) => {
      this.socket.on('onCallCancelled', (key: CancellationCallMessage) => {
        observer.next(key);
      });
    });
  }

  joinUserRoom(key: string): void {
    this.socket.emit('joinPrivateRoom', { key });
  }

  startMediaCall(targetUserId: string, sourceUserId: string): void {
    this.socket.emit('subscribeIncomingCall', { targetUserId, sourceUserId });
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
