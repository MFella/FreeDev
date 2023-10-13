import { InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { MessageToCreateDto } from 'src/dtos/websocket-message/messageToCreateDto';
import {
  WebSocketMessage,
  WebSocketMessageDocument,
} from './web-socket-message.schema';

export class WebSocketMessageService {
  constructor(
    @InjectModel(WebSocketMessage.name)
    private readonly messageModel: Model<WebSocketMessageDocument>,
  ) {}

  async createMessage(
    messageToCreateDto: MessageToCreateDto,
  ): Promise<WebSocketMessage & { _id: ObjectId }> {
    try {
      return await (
        await this.messageModel.create(messageToCreateDto)
      ).populate('replyMessage');
    } catch (error) {
      throw new InternalServerErrorException(
        'Error occured during saving data.',
      );
    }
  }

  async getSavedMessages(roomKey: string): Promise<any> {
    try {
      const messagesFromDb = await this.messageModel.find({
        key: roomKey,
      });
      return messagesFromDb;
    } catch (e) {
      throw new InternalServerErrorException(
        'Error occured during fetching data.',
      );
    }
  }

  async getPartialSavedMessages(
    messageFrom: number,
    messageStep: number,
    roomKey: string,
  ): Promise<any> {
    try {
      const replyMessageAttributesToSelect: Array<keyof WebSocketMessage> = [
        'sender',
        'content',
      ];
      const messagesFromDb = await this.messageModel
        .find({
          key: roomKey,
        })
        .sort({ sendTime: -1 })
        .skip(messageFrom)
        .limit(messageStep)
        .populate('replyMessage', replyMessageAttributesToSelect);

      console.log(messagesFromDb);
      return messagesFromDb;
    } catch (error: unknown) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error occured during fetching partial data.',
      );
    }
  }

  async getMessageById(messageId: string): Promise<any> {
    return this.messageModel.findById(messageId);
  }
}
