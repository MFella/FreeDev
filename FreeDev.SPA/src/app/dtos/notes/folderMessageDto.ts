import {MessageType} from "../../types/message/messageType";

//TODO: refactor Dtos to meet class-validator constraints
export interface FolderMessageDto {
  _id: string;
  type: MessageType;
  isRead: boolean;
  sendTime: Date;
  title: string;
  senderId?: UserData;
  receiverId?: UserData;
}

export interface UserData {
  _id: string;
  name: string;
  surname: string;
}
