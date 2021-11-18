import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment as env } from '../../environments/environment';

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
}
