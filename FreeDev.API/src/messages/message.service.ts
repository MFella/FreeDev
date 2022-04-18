import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageToSendDto } from 'src/dtos/messages/messageToSendDto';
import { UsersService } from 'src/users/users.service';
import { Message, MessageDocument } from './message.schema';

export class MessageService {
  constructor(
    private readonly usersServ: UsersService,
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  async tryToSaveMessage(
    userId: string,
    messageToSendDto: MessageToSendDto,
  ): Promise<boolean> {
    const senderFromDb = await this.usersServ.findUserById(userId);
    const receiverFromDb = await this.usersServ.findUserById(
      messageToSendDto?.receiverId,
    );

    if (!Object.values(senderFromDb) || !Object.values(receiverFromDb)) {
      throw new NotFoundException('Users with this details doesnt exists!');
    }

    const messageFromDb = await this.messageModel.find({
      senderId: userId,
      receiverId: messageToSendDto.receiverId,
      type: messageToSendDto.messageType,
    });

    if (Object.values(messageFromDb).length > 0) {
      throw new BadRequestException('Request has already been sent!');
    }

    try {
      await this.messageModel.create({
        content: messageToSendDto.content,
        type: messageToSendDto.messageType,
        senderId: userId,
        receiverId: messageToSendDto.receiverId,
        sendTime: new Date(),
        isRead: false,
      });

      return true;
    } catch (ex: any) {
      console.error(ex);
      throw new InternalServerErrorException(
        'Error occured during saving message',
      );
    }
  }
}
