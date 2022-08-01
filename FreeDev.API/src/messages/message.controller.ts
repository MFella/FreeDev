import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import {JwtAuthGuard} from 'src/auth/jwt-auth.guard';
import {DirectMessageToSendDto} from 'src/dtos/messages/directMessageToSendDto';
import {FolderType} from 'src/types/notes/folderType';
import {MessageService} from './message.service';

@Controller('message')
export class MessageController {
    constructor(private readonly messageServ: MessageService) {
    }

    @Post('')
    @UseGuards(JwtAuthGuard)
    async sendMessage(
        @Req() request: any,
        @Body() messageToSendDto: DirectMessageToSendDto,
    ): Promise<boolean> {
        return await this.messageServ.tryToSaveMessage(
            request?.user?.userId,
            messageToSendDto,
        );
    }

    @Get('folder')
    @UseGuards(JwtAuthGuard)
    async getFolderMessages(
        @Query() folderQuery: { folderType: FolderType },
        @Req() request: any,
    ): Promise<any> {
        return await this.messageServ.getFolderMessages(
            folderQuery.folderType,
            request?.user?.userId,
        );
    }
}
