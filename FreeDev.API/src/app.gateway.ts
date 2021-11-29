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

  @SubscribeMessage('onlyJoin')
  joinPrivateRoom(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): void {
    if (!this.connectedUsers.hasOwnProperty(data._id)) {
      this.connectedUsers[data._id] = client;
    }
    console.log('dasdas');
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

    if (this.connectedUsers.hasOwnProperty(data.receiver)) {
      this.connectedUsers[data.receiver].emit(
        'privateResponse',
        messageToResponse,
      );
      // save meesage in model ;)
    }

    if (this.connectedUsers.hasOwnProperty(data.sender)) {
      this.connectedUsers[data.sender].emit(
        'privateResponse',
        messageToResponse,
      );
    }
  }
}
