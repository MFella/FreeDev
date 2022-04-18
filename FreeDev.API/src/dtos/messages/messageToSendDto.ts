import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { MessageType } from './messageType';

export class MessageToSendDto {
  @IsEnum(() => MessageType)
  messageType: MessageType;

  @IsString()
  receiverId: string;

  @IsDate()
  @IsOptional()
  sendTime: Date = new Date();

  @IsString()
  content: string;
}
