export interface MessageToCreateDto {
  content: string;
  sender: string;
  receiver: string;
  key: string;
  replyMessage: string | undefined;
}
