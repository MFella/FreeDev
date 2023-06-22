import {Body, Controller, Get, Post, Put, Query, Req, UseGuards} from "@nestjs/common";
import {MailService} from "./mail.service";
import {ContentMessageQuery} from "../types/notes/contentMessageQuery";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {DirectMessageToSendDto} from "../dtos/messages/directMessageToSendDto";
import {IndirectMessageToSendDto} from "../dtos/messages/indirectMessageToSend";
import {FolderType} from "../types/notes/folderType";
import {Mail} from "./mail.schema";
import {MoveMailDto} from "../dtos/mail/moveMailDto";

@Controller('mail')
export class MailController {
    constructor(
        private readonly mailService: MailService
    ) {
    }

    @Post('direct')
    @UseGuards(JwtAuthGuard)
    async sendDirectMessage(@Body() directMessageToSendDto: DirectMessageToSendDto, @Req() request: any): Promise<boolean> {
        return await this.mailService.tryToSaveDirectMessage(directMessageToSendDto, request?.user?.userId);
    }

    @Post('indirect')
    @UseGuards(JwtAuthGuard)
    async sendIndirectMessage(@Body() indirectMessageToSendDto: IndirectMessageToSendDto, @Req() request: any): Promise<boolean> {
        return await this.mailService.tryToSaveIndirectMessage(indirectMessageToSendDto, request?.user?.userId);
    }

    @Get('content')
    @UseGuards(JwtAuthGuard)
    async getMessageContent(@Query() contentMessageQuery: ContentMessageQuery, @Req() request): Promise<Partial<Mail>> {
        return await this.mailService.getMessageContent(contentMessageQuery?.messageId, request.user.userId);
    }

    @Put('content')
    @UseGuards(JwtAuthGuard)
    async updateMessageReadStatus(@Body() messageIdDto: { messageId: string }): Promise<boolean> {
        return await this.mailService.updateMessageReadStatus(messageIdDto.messageId);
    }

    @Put('')
    @UseGuards(JwtAuthGuard)
    async moveMessageToFolder(@Body() moveMailDto: MoveMailDto, @Req() request: any): Promise<boolean> {
        return await this.mailService.moveMailToFolder(moveMailDto.mailId, moveMailDto.targetFolder, request.user.userId);
    }

    @Get('folder')
    @UseGuards(JwtAuthGuard)
    async getFolderMessages(
        @Query() folderQuery: { folderType: FolderType },
        @Req() request: any,
    ): Promise<Array<Partial<Mail>>> {
        return await this.mailService.getFolderMessages(
            folderQuery.folderType,
            request?.user?.userId,
        );
    }
}
