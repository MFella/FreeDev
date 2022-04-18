import { CurrentLoggedUser } from './types/logged-users/currentLoggedUser';
import { WebSocketMessageService } from './web-socket-messages/webSocketMessage.service';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageToCreateDto } from './dtos/websocket-message/messageToCreateDto';
import { MessageToRoom } from './types/messageToRoom';
import { UsersService } from './users/users.service';
import { MessageAnswerCall } from './types/messageAnswerCall';
@WebSocketGateway(443, { cors: true })
export class AppGateway {
  connectedUsers: Array<any> = [];

  constructor(
    private readonly userServ: UsersService,
    private readonly messageServ: WebSocketMessageService,
  ) {}

  @WebSocketServer()
  server!: Server;

  handleConnection(): void {
    console.log('connected');
  }

  @SubscribeMessage('ackLogAction')
  ackLogAction(@MessageBody() logPayload: CurrentLoggedUser): void {
    this.userServ.saveLoggedUser(logPayload);

    const connectedUsers = this.userServ.getConnectedUsers();
    this.server.emit('getLoggedInUsers', connectedUsers);
  }

  @SubscribeMessage('loggedInUsers')
  getLoggedUsers(
    @MessageBody() visibleUsersIds: Array<string>,
    @ConnectedSocket() connectedSocket: any,
  ): void {
    const connectedUsers = this.userServ
      .getConnectedUsers()
      .filter((user: CurrentLoggedUser) => visibleUsersIds.includes(user.id));
    this.server.to(connectedSocket.id).emit('getLoggedInUsers', connectedUsers);
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

  @SubscribeMessage('subscribeIncomingCall')
  async handleIncomingCall(
    @ConnectedSocket() connectedSocket,
    @MessageBody() data: MessageAnswerCall,
  ): Promise<void> {
    this.server.emit('callAnswer', data);
  }
}
