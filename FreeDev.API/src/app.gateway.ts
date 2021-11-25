import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@WebSocketGateway(443, { cors: true })
export class AppGateway {
  @WebSocketServer()
  server!: Server;

  handleConnection(): void {
    console.log('connected');
  }

  @SubscribeMessage('joinPrivateRoom')
  joinPrivateRoom(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): void {
    console.log(data);
    client.join(data.roomId);
  }

  @SubscribeMessage('privateMessage')
  handlePrivateMessage(
    @ConnectedSocket() connectedSocket,
    @MessageBody() data: any,
  ): void {
    this.server.to(data.userId).emit('private message', {
      body: data.body,
      from: connectedSocket.id,
    });
  }
}
