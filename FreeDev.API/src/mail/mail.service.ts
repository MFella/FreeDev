import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Mail, MailDocument} from "./mail.schema";
import {Model} from "mongoose";
import {MailMessageToSendDto} from "../types/notes/mailMessageToSendDto";
import {UsersService} from "../users/users.service";

@Injectable()
export class MailService {

    constructor(
        @InjectModel(Mail.name)
        private readonly mailModel: Model<MailDocument>,
        private readonly usersService: UsersService
    ) {
    }

    async tryToSaveMessage(mailMessageToSendDto: MailMessageToSendDto, userId: string): Promise<boolean> {
        try {
            const senderFromDb = await this.usersService.findUserById(userId);
            const receiverFromDb = await this.usersService.findUserByEmail(mailMessageToSendDto.receiverMailAddress);
            if (Object.keys(senderFromDb)?.length && Object.keys(receiverFromDb)?.length) {
                const mailToSave = {
                    senderId: userId,
                    receiverId: receiverFromDb?._id.toString(),
                    content: mailMessageToSendDto.content,
                    title: mailMessageToSendDto.title,
                    sendTime: new Date(),
                    isRead: false
                };
                await this.mailModel.create(mailToSave);
                return true;
            }
        } catch (_ex: unknown) {
            throw new InternalServerErrorException('Something went wrong');
        }
    }


}
