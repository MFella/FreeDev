import { IsDate, IsString } from 'class-validator';

export class MessageToCreateDto {
  @IsString()
  sender: string;

  @IsString()
  receiver: string;

  @IsString()
  key: string;

  @IsString()
  content: string;

  @IsDate()
  sendTime: Date = new Date();
}
