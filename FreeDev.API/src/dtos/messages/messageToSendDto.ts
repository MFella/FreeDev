import {
  IsDate,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { MessageType } from './messageType';

export class MessageToSendDto {
  @IsEnum(MessageType)
  messageType: MessageType;

  @IsString()
  receiverId: string;

  @IsDateString()
  @IsOptional()
  sendTime: Date = new Date();

  @IsString()
  content: string;

  @IsString()
  title: string;
}
