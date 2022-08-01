import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Mail, MailDocument} from "./mail.schema";
import {Model} from "mongoose";
import {UsersService} from "../users/users.service";
import {DirectMessageToSendDto} from "../dtos/messages/directMessageToSendDto";
import {IndirectMessageToSendDto} from "../dtos/messages/indirectMessageToSend";
import {FolderType} from "../types/notes/folderType";

@Injectable()
export class MailService {

    constructor(
        @InjectModel(Mail.name)
        private readonly mailModel: Model<MailDocument>,
        private readonly usersService: UsersService
    ) {
    }

    async tryToSaveIndirectMessage(indirectMessageToSendDto: IndirectMessageToSendDto, userId: string): Promise<boolean> {
        const senderFromDb = await this.usersService.findUserById(userId);
        const receiverFromDb = await this.usersService.findUserByEmail(indirectMessageToSendDto.receiverMailAddress);

        if (!Object.values(senderFromDb) || !Object.values(receiverFromDb)) {
            throw new NotFoundException('Users with this details doesnt exists!');
        }

        try {
            await this.mailModel.create({
                content: indirectMessageToSendDto.content,
                title: indirectMessageToSendDto.title,
                type: indirectMessageToSendDto.messageType,
                sender: userId,
                receiver: receiverFromDb._id,
                sendTime: new Date(),
                isRead: false
            });

            return true;
        } catch (ex: any) {
            console.error(ex);
            throw new InternalServerErrorException(
                'Error occured during saving message',
            );
        }
    }

    async tryToSaveDirectMessage(
        directMessageToSendDto: DirectMessageToSendDto,
        userId: string,
    ): Promise<boolean> {
        const senderFromDb = await this.usersService.findUserById(userId);
        const receiverFromDb = await this.usersService.findUserById(
            directMessageToSendDto?.receiverId,
        );

        if (!Object.values(senderFromDb) || !Object.values(receiverFromDb)) {
            throw new NotFoundException('Users with this details doesnt exists!');
        }

        const messageFromDb = await this.mailModel.findOne({
            senderId: userId,
            receiverId: directMessageToSendDto.receiverId,
            type: directMessageToSendDto.messageType,
        });

        if (Object.values(messageFromDb ?? {}).length > 0) {
            throw new BadRequestException('Request has already been sent!');
        }

        try {
            await this.mailModel.create({
                content: directMessageToSendDto.content,
                title: directMessageToSendDto.title,
                type: directMessageToSendDto.messageType,
                senderId: userId,
                receiverId: directMessageToSendDto.receiverId,
                sendTime: new Date(),
                isRead: false,
            });

            return true;
        } catch (ex: any) {
            console.error(ex);
            throw new InternalServerErrorException(
                'Error occured during saving message',
            );
        }
    }

    async getMessage(messageId: string, userId: string): Promise<string> {
        try {
            const mailFromRepository = await this.mailModel.findOne({_id: messageId})

            if (!mailFromRepository) {
                throw new NotFoundException('Cant find that message');
            }

            if ([mailFromRepository.receiverId?.toString(), mailFromRepository.senderId?.toString()].includes(userId)) {
                return mailFromRepository.content;
            } else {
                throw new ForbiddenException('You are not allowed to read this message');
            }
        } catch (e) {
            throw new InternalServerErrorException('Error occurred during retrieving data!');
        }
    }

    async getFolderMessages(
        folderType: FolderType,
        userId: string,
    ): Promise<Array<Partial<Mail>>> {
        const userAttributesToSelect = ['_id', 'name', 'surname'];
        const messageAttributesToSelect = ['_id', 'isRead', 'sendTime', 'title', 'type'];
        switch (folderType) {
            case FolderType.inbox: {
                return await this.mailModel
                    .find({
                        $or: [{receiverId: userId.toString()}],
                    })
                    .populate('receiverId', userAttributesToSelect)
                    .select(messageAttributesToSelect)
                    .exec();
            }
            case FolderType.send: {
                return await this.mailModel
                    .find({
                        $or: [{senderId: userId.toString()}],
                    })
                    .populate('senderId', userAttributesToSelect)
                    .select(messageAttributesToSelect)
                    .exec();
            }
            default:
                throw new BadRequestException('Cant find messages with that folder id');
        }
    }
}
