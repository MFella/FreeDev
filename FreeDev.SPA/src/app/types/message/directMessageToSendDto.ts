import {MessageType} from './messageType';

export class DirectMessageToSendDto {
  constructor(
    private readonly receiverId: string,
    private readonly messageType: MessageType,
    private readonly title: string,
    private readonly content: string
  ) {
  }
}
