import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileService } from 'src/files/file.service';
import { Developer, DeveloperSchema } from './developer.schema';
import { Hunter, HunterSchema } from './hunter.schema';
import { UsersService } from './users.service';
import { File, FileSchema } from '../files/file.schema';
import { ConfigService } from '@nestjs/config';
import { UsersController } from './users.controller';
import {
  RoomKey,
  RoomKeySchema,
} from 'src/web-socket-messages/room-key.schema';
import { WebSocketMessageModule } from 'src/web-socket-messages/web-socket-message.module';
import { Message, MessageSchema } from 'src/messages/message.schema';

@Module({
  imports: [
    WebSocketMessageModule,
    MongooseModule.forFeature([
      { name: Developer.name, schema: DeveloperSchema },
      { name: Hunter.name, schema: HunterSchema },
      { name: File.name, schema: FileSchema },
      { name: RoomKey.name, schema: RoomKeySchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  providers: [UsersService, FileService, ConfigService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
