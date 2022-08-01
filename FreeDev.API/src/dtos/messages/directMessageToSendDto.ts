import {
    IsEnum,
    IsString,
} from 'class-validator';
import {MessageType} from './messageType';

export class DirectMessageToSendDto {
    @IsEnum(MessageType)
    messageType: MessageType;

    @IsString()
    receiverId: string;

    @IsString()
    content: string;

    @IsString()
    title: string;
}
