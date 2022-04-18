import { IsNumber, IsString } from 'class-validator';

export class PartialMessageFetchDto {
  @IsString()
  messageFrom: string;

  @IsString()
  messageStep: string;

  @IsString()
  roomKey: string;
}
