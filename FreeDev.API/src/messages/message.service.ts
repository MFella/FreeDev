import { InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageToCreateDto } from 'src/dtos/message/messageToCreateDto';
import { Message, MessageDocument } from './message.schema';

export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
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
}
