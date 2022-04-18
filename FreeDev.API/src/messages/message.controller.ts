import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MessageToSendDto } from 'src/dtos/messages/messageToSendDto';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageServ: MessageService) {}
  @Post('')
  @UseGuards(JwtAuthGuard)
  async sendMessage(
    @Req() request: any,
    @Body() messageToSendDto: MessageToSendDto,
  ): Promise<boolean> {
    return await this.messageServ.tryToSaveMessage(
      request?.user?._id,
      messageToSendDto,
    );
  }
}
