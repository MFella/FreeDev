import { Message, MessageSchema } from './message.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomKey, RoomKeySchema } from './room-key.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: RoomKey.name, schema: RoomKeySchema },
    ]),
  ],
})
export class MessageModule {}
