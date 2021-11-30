import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageToRoom } from './types/messageToRoom';
import { UsersService } from './users/users.service';
@WebSocketGateway(443, { cors: true })
export class AppGateway {
  connectedUsers: any = {};

  constructor(private readonly userServ: UsersService) {}

  @WebSocketServer()
  server!: Server;

  handleConnection(): void {
    console.log('connected');
  }

  @SubscribeMessage('joinPrivateRoom')
  joinPrivateRoom(
    @MessageBody() data: { key: string },
    @ConnectedSocket() client: Socket,
  ): void {
    if (!this.connectedUsers.hasOwnProperty(data.key)) {
      this.connectedUsers[data.key] = client;
    }
    client.join(data.key);
  }

  @SubscribeMessage('privateMessage')
  handlePrivateMessage(
    @ConnectedSocket() connectedSocket,
    @MessageBody() data: MessageToRoom,
  ): void {
    const messageToResponse: any = {
      message: data.content,
      sender: data.sender,
      sendTime: new Date(),
    };

    this.server.to(data.key).emit('privateResponse', messageToResponse);
  }
}
