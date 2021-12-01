import { Controller, Get, Query } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageServ: MessageService) {}

  @Get('all')
  async getSavedMessaged(@Query() query: { key: string }) {
    return await this.messageServ.getSavedMessages(query.key);
  }
}
