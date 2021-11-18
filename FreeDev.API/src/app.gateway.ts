import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
// tslint:disable
@WebSocketGateway()
export class AppGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('joinRoom')
  joinRoom(@MessageBody() data: any): void {
    console.log(data);
  }
}
