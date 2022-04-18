import { Controller, Get, Query } from '@nestjs/common';
import { PartialMessageFetchDto } from 'src/dtos/websocket-message/partialMessageFetchDto';
import { WebSocketMessageService } from './webSocketMessage.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageServ: WebSocketMessageService) {}

  @Get('all')
  async getSavedMessaged(@Query() query: { key: string }) {
    return await this.messageServ.getSavedMessages(query.key);
  }

  @Get('partials')
  async getPartialSavedMessages(@Query() query: PartialMessageFetchDto) {
    return await this.messageServ.getPartialSavedMessages(
      Number(query.messageFrom),
      Number(query.messageStep),
      query.roomKey,
    );
  }
}
