import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileService } from 'src/files/file.service';
import { Developer, DeveloperSchema } from './developer.schema';
import { Hunter, HunterSchema } from './hunter.schema';
import { UsersService } from './users.service';
import { File, FileSchema } from '../files/file.schema';
import { ConfigService } from '@nestjs/config';
import { UsersController } from './users.controller';
import { RoomKey, RoomKeySchema } from 'src/messages/room-key.schema';
import { MessageModule } from 'src/messages/message.module';

@Module({
  imports: [
    MessageModule,
    MongooseModule.forFeature([
      { name: Developer.name, schema: DeveloperSchema },
      { name: Hunter.name, schema: HunterSchema },
      { name: File.name, schema: FileSchema },
      { name: RoomKey.name, schema: RoomKeySchema },
    ]),
  ],
  providers: [UsersService, FileService, ConfigService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
