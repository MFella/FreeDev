import { InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

  async createMessage(messageToCreateDto: MessageToCreateDto): Promise<void> {
    try {
      await this.messageModel.create(messageToCreateDto);
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
      const messagesFromDb = await this.messageModel
        .find({
          key: roomKey,
        })
        .sort({ sendTime: -1 })
        .skip(messageFrom)
        .limit(messageStep);

      return messagesFromDb;
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        'Error occured during fetching partial data.',
      );
    }
  }
}
