import {IsString} from "class-validator";

export class ContentMessageQuery {
    @IsString()
    messageId: string;
}
