import {IsString} from "class-validator";

export class MailMessageToSendDto {

    @IsString()
    receiverMailAddress: string;

    @IsString()
    kindOfMail: string;

    @IsString()
    content: string;

    @IsString()
    title: string;
}
