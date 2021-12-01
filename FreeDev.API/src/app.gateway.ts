import { MessageService } from './messages/message.service';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageToCreateDto } from './dtos/message/messageToCreateDto';
import { MessageToRoom } from './types/messageToRoom';
import { UsersService } from './users/users.service';
@WebSocketGateway(443, { cors: true })
export class AppGateway {
  connectedUsers: any = {};

  constructor(
    private readonly userServ: UsersService,
    private readonly messageServ: MessageService,
  ) {}

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
  async handlePrivateMessage(
    @ConnectedSocket() connectedSocket,
    @MessageBody() data: MessageToRoom,
  ): Promise<void> {
    const messageToResponse: any = {
      message: data.content,
      sender: data.sender,
      sendTime: new Date(),
    };

    this.server.to(data.key).emit('privateResponse', messageToResponse);

    const messageToCreate: MessageToCreateDto = {
      content: data.content,
      sender: data.sender,
      receiver: data.receiver,
      sendTime: messageToResponse.sendTime,
      key: data.key,
    };

    await this.messageServ.createMessage(messageToCreate);
  }
}
