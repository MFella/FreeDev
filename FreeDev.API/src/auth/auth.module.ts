import {Module} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {JwtModule} from '@nestjs/jwt';
import {MongooseModule} from '@nestjs/mongoose';
import {PassportModule} from '@nestjs/passport';
import {FileSchema, File} from 'src/files/file.schema';
import {FileService} from 'src/files/file.service';
import {WebSocketMessageModule} from 'src/web-socket-messages/web-socket-message.module';
import {
    RoomKey,
    RoomKeySchema,
} from 'src/web-socket-messages/room-key.schema';
import {Developer, DeveloperSchema} from 'src/users/developer.schema';
import {Hunter, HunterSchema} from 'src/users/hunter.schema';
import {UsersService} from 'src/users/users.service';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {constans} from './constans';
import {JwtAuthGuard} from './jwt-auth.guard';
import {JwtStrategy} from './jwt.strategy';
import {Message, MessageSchema} from 'src/messages/message.schema';
import {Mail, MailSchema} from "../mail/mail.schema";

@Module({
    imports: [
        WebSocketMessageModule,
        MongooseModule.forFeature([
            {name: Developer.name, schema: DeveloperSchema},
            {name: Hunter.name, schema: HunterSchema},
            {name: File.name, schema: FileSchema},
            {name: RoomKey.name, schema: RoomKeySchema},
            {name: Message.name, schema: MessageSchema},
            {name: Mail.name, schema: MailSchema},
        ]),
        PassportModule,
        JwtModule.register({
            secret: constans.secret,
            signOptions: {expiresIn: constans.expiresIn},
        }),
    ],
    providers: [
        ConfigService,
        AuthService,
        UsersService,
        FileService,
        JwtStrategy,
        JwtAuthGuard,
    ],
    controllers: [AuthController],
})
export class AuthModule {
}
