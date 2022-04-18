import { MessageType } from './messageType';

export class MessageToSendDto {
  constructor(
    private readonly receiverId: string,
    private readonly sendTime: Date,
    private readonly messageType: MessageType,
    private readonly content: string
  ) {}
}
