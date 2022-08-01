import {MessageType} from "./messageType";

export class IndirectMessageToSendDto {
  constructor(
    private readonly receiverMailAddress: string,
    private readonly messageType: MessageType,
    private readonly title: string,
    private readonly content: string
  ) {
  }

}
