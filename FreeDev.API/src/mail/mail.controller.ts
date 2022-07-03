import {Body, Controller, Post, Req} from "@nestjs/common";
import {MailService} from "./mail.service";
import {MailMessageToSendDto} from "../types/notes/mailMessageToSendDto";

@Controller('mail')
export class MailController {
    constructor(
        private readonly mailService: MailService
    ) {
    }

    @Post('')
    async sendMessage(@Body() mailMessageToSendDto: MailMessageToSendDto, @Req() request: any): Promise<any> {
        return await this.mailService.tryToSaveMessage(mailMessageToSendDto, request?.user?.userId);
    }
}
