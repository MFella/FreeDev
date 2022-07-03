import {Module} from "@nestjs/common";
import {MailService} from "./mail.service";
import {MailController} from "./mail.controller";
import {MongooseModule} from "@nestjs/mongoose";
import {Mail, MailSchema} from "./mail.schema";
import {UsersService} from "../users/users.service";
import {Developer, DeveloperSchema} from "../users/developer.schema";
import {Hunter, HunterSchema} from "../users/hunter.schema";
import {RoomKey, RoomKeySchema} from "../web-socket-messages/room-key.schema";
import {Message, MessageSchema} from "../messages/message.schema";
import {FileService} from "../files/file.service";
import {File, FileSchema} from "../files/file.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Mail.name, schema: MailSchema},
            {name: Developer.name, schema: DeveloperSchema},
            {name: Hunter.name, schema: HunterSchema},
            {name: RoomKey.name, schema: RoomKeySchema},
            {name: Message.name, schema: MessageSchema},
            {name: File.name, schema: FileSchema},
        ]),
    ],
    providers: [MailService, UsersService, FileService],
    controllers: [MailController]
})
export class MailModule {
}