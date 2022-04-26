import {
  WebSocketMessage,
  WebSocketMessageSchema,
} from './web-socket-message.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomKey, RoomKeySchema } from './room-key.schema';
import { WebSocketMessageService } from './webSocketMessage.service';
import { MessageController } from './message.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WebSocketMessage.name, schema: WebSocketMessageSchema },
      { name: RoomKey.name, schema: RoomKeySchema },
    ]),
  ],
  controllers: [MessageController],
  providers: [WebSocketMessageService],
  exports: [WebSocketMessageService],
})
export class WebSocketMessageModule {}
