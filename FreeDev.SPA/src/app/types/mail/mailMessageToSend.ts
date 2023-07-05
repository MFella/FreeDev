export class MailMessageToSend {
  constructor(
    private readonly receiverMailAddress: string,
    private readonly kindOfMessage: any,
    private readonly content: string,
    private readonly title: string
  ) {
  }
}
