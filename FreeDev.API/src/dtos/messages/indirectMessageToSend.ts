import {IsEnum, IsString} from "class-validator";
import {MessageType} from "./messageType";

export class IndirectMessageToSendDto {
    @IsString()
    receiverMailAddress: string;

    @IsEnum(MessageType)
    messageType: MessageType;

    @IsString()
    title: string;

    @IsString()
    content: string
}