import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Mail, MailDocument } from './mail.schema';
import { Model, Types } from 'mongoose';
import { UsersService } from '../users/users.service';
import { DirectMessageToSendDto } from '../dtos/messages/directMessageToSendDto';
import { IndirectMessageToSendDto } from '../dtos/messages/indirectMessageToSend';
import { FolderType } from '../types/notes/folderType';

@Injectable()
export class MailService {
  constructor(
    @InjectModel(Mail.name)
    private readonly mailModel: Model<MailDocument>,
    private readonly usersService: UsersService,
  ) {}

  async tryToSaveIndirectMessage(
    indirectMessageToSendDto: IndirectMessageToSendDto,
    userId: string,
  ): Promise<boolean> {
    const senderFromDb = await this.usersService.findUserById(userId);
    const receiverFromDb = await this.usersService.findUserByEmail(
      indirectMessageToSendDto.receiverMailAddress,
    );

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
        receiverRoleReference: directMessageToSendDto.receiverRole,
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

  async getMessageContent(
    mailId: string,
    userId: Types.ObjectId,
  ): Promise<Partial<Mail>> {
    try {
      const mailFromRepository = await this.mailModel
        .findById(mailId)
        .select(['title', 'content', 'receiverId', 'senderId']);

      if (!mailFromRepository) {
        throw new NotFoundException('Cant find that message');
      }

      const allowedUsersIds = [
        mailFromRepository.receiverId?.toString(),
        mailFromRepository.senderId?.toString(),
      ];

      if (allowedUsersIds.includes(userId.toString())) {
        return mailFromRepository;
      } else {
        throw new ForbiddenException(
          'You are not allowed to read this message',
        );
      }
    } catch (e) {
      throw new InternalServerErrorException(
        'Error occurred during retrieving data!',
      );
    }
  }

  async updateMessageReadStatus(mailId: string): Promise<boolean> {
    const mailReadToUpdate = { isRead: true };
    const mailFromDb = await this.mailModel.findById(mailId);

    if (!mailFromDb) {
      throw new NotFoundException('That message id doesnt exist');
    }

    return !!(await this.mailModel.findByIdAndUpdate(mailId, mailReadToUpdate));
  }

  async getFolderMessages(
    folderType: FolderType,
    userId: string,
  ): Promise<Array<Partial<Mail>>> {
    const userAttributesToSelect = ['_id', 'name', 'surname'];
    const messageAttributesNotToSelect = ['-senderId', '-title', '-content'];
    switch (folderType.toUpperCase()) {
      case FolderType.INBOX: {
        return await this.mailModel
          .find({
            $or: [{ receiverId: userId.toString() }],
            $and: [{ receiverBelongFolder: FolderType.INBOX }],
          })
          .populate('senderId', userAttributesToSelect)
          .select(messageAttributesNotToSelect)
          .exec();
      }
      case FolderType.SEND: {
        return await this.mailModel
          .find({
            $or: [{ senderId: userId.toString() }],
            $and: [{ senderBelongFolder: FolderType.SEND }],
          })
          .populate('receiverId', userAttributesToSelect)
          .select(messageAttributesNotToSelect)
          .exec();
      }
      case FolderType.SPAM: {
        return await this.mailModel
          .find({
            $or: [{ receiverId: userId.toString() }],
            $and: [{ receiverBelongFolder: FolderType.SPAM }],
          })
          .populate('senderId', userAttributesToSelect)
          .select(messageAttributesNotToSelect)
          .exec();
      }
      case FolderType.BIN: {
        return await this.mailModel
          .find({
            $or: [{ receiverId: userId.toString() }],
            $and: [{ receiverBelongFolder: FolderType.BIN }],
          })
          .populate('senderId', userAttributesToSelect)
          .select(messageAttributesNotToSelect)
          .exec();
      }
      default:
        throw new BadRequestException('Cant find messages with that folder id');
    }
  }

  async moveMailToFolder(
    mailId: string,
    targetFolder: FolderType,
    userId: string,
  ): Promise<boolean> {
    const mailFromRepository = await this.mailModel.findById(mailId);
    if (!mailFromRepository) {
      throw new NotFoundException('Cant find that message');
    }

    if (mailFromRepository.receiverId?.toString() === userId) {
      return !!(await this.mailModel.findByIdAndUpdate(mailId, {
        receiverBelongFolder: targetFolder,
      }));
    }
    if (mailFromRepository.senderId?.toString() === userId) {
      return !!(await this.mailModel.findByIdAndUpdate(mailId, {
        senderBelongFolder: targetFolder,
      }));
    }
  }
}
