export interface MessageToRoom {
  sender: string;
  receiver: string;
  content: string;
  key: string;
  replyMessage: string | undefined;
}
