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
import { CancellationCallMessage } from './types/cancellationCallMessage';
import { IncomingCallPayload } from './types/incomingCallPayload';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';
@WebSocketGateway(443, { cors: true })
export class AppGateway {
  connectedUsers: Array<any> = [];

  constructor(
    private readonly userServ: UsersService,
    private readonly messageServ: WebSocketMessageService,
    private readonly configService: ConfigService,
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
    @MessageBody() data: MessageToRoom,
  ): Promise<void> {
    const replyMessage = await this.messageServ.getMessageById(
      data.replyMessage,
    );

    try {
      const messageToCreate: MessageToCreateDto = {
        content: data.content,
        sender: data.sender,
        receiver: data.receiver,
        sendTime: new Date(),
        key: data.key,
        replyMessage: replyMessage ? data.replyMessage : undefined,
      };

      const createdMessage = await this.messageServ.createMessage(
        messageToCreate,
      );

      const messageToResponse = {
        id: createdMessage?._id?.toString(),
        content: data.content,
        sender: data.sender,
        sendTime: messageToCreate.sendTime,
        replyMessage: createdMessage?.replyMessage,
        ...(replyMessage ? { replyMessageContent: replyMessage.content } : {}),
        ...(replyMessage
          ? { amIReplyMessageOwner: replyMessage.sender === data.sender }
          : {}),
      };

      this.server.to(data.key).emit('privateResponse', messageToResponse);
    } catch (e: unknown) {
      console.error(e);
      throw new InternalServerErrorException(
        'Error occured during saving chat message',
      );
    }
  }

  @SubscribeMessage('subscribeIncomingCall')
  async handleIncomingCall(
    @MessageBody() incomingCallPayload: IncomingCallPayload,
  ): Promise<void> {
    const sourceUserFromDb = await this.userServ.findUserById(
      incomingCallPayload.sourceUserId,
    );

    this.server.emit('callAnswer', {
      imageUrl:
        sourceUserFromDb?.avatar?.url ??
        this.configService.get<string>('DEFAULT_USER_IMAGE_URL'),
      name: sourceUserFromDb?.name,
      surname: sourceUserFromDb?.surname,
      ...incomingCallPayload,
    });
  }

  @SubscribeMessage('cancelCall')
  async onCancellationOfCall(
    @MessageBody() cancellationCallMessage: CancellationCallMessage,
  ): Promise<void> {
    console.log(cancellationCallMessage);
    this.server.emit('onCallCancelled', cancellationCallMessage);
  }
}
