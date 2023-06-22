import {MessageType} from './messageType';
import {Roles} from "../roles.enum";

export class DirectMessageToSendDto {
  constructor(
    private readonly receiverId: string,
    private readonly messageType: MessageType,
    private readonly title: string,
    private readonly content: string,
    private readonly receiverRole: Roles
  ) {
  }
}
