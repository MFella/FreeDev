import {
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {DirectMessageToSendDto} from 'src/dtos/messages/directMessageToSendDto';
import {FolderType} from 'src/types/notes/folderType';
import {UsersService} from 'src/users/users.service';
import {Message, MessageDocument} from './message.schema';

export class MessageService {
    constructor(
        private readonly usersServ: UsersService,
        @InjectModel(Message.name)
        private readonly messageModel: Model<MessageDocument>,
    ) {
    }

    async tryToSaveMessage(
        userId: string,
        messageToSendDto: DirectMessageToSendDto,
    ): Promise<boolean> {
        const senderFromDb = await this.usersServ.findUserById(userId);
        const receiverFromDb = await this.usersServ.findUserById(
            messageToSendDto?.receiverId,
        );

        if (!Object.values(senderFromDb) || !Object.values(receiverFromDb)) {
            throw new NotFoundException('Users with this details doesnt exists!');
        }

        const messageFromDb = await this.messageModel.findOne({
            senderId: userId,
            receiver: messageToSendDto.receiverId,
            type: messageToSendDto.messageType,
        });

        if (Object.values(messageFromDb ?? {}).length > 0) {
            throw new BadRequestException('Request has already been sent!');
        }

        try {
            await this.messageModel.create({
                content: messageToSendDto.content,
                title: messageToSendDto.title,
                type: messageToSendDto.messageType,
                sender: userId,
                receiver: messageToSendDto.receiverId,
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

    async getFolderMessages(
        folderType: FolderType,
        userId: string,
    ): Promise<any> {
        const userAttributesToSelect = ['_id', 'name', 'surname'];
        const messageAttributesToSelect = ['_id', 'isRead', 'sendTime', 'title', 'type'];
        switch (folderType) {
            case FolderType.INBOX: {
                const messagesFromInbox = await this.messageModel
                    .find({
                        $or: [{receiver: userId}],
                    })
                    .populate('sender', userAttributesToSelect).select(messageAttributesToSelect)
                    .exec();
                return messagesFromInbox;
            }
            case FolderType.SEND: {
                const messagesFromInbox = await this.messageModel
                    .find({
                        $or: [{sender: userId}],
                    })
                    .populate('receiver', userAttributesToSelect)
                    .select(messageAttributesToSelect)
                    .exec();
                return messagesFromInbox;
            }
            default:
                throw new BadRequestException('Cant find messages with that folder id');
        }
    }

    private async getFolderMessageByFolderType(
        folderType: FolderType,
        userId: string,
    ): Promise<any> {
        const messagesFromInbox = await this.messageModel
            .find({
                $or: [
                    {type: folderType, senderId: userId},
                    {type: folderType, receiverId: userId},
                ],
            })
            .exec();
        return messagesFromInbox;
    }
}
