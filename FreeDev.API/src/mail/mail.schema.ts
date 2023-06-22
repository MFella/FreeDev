import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Schema as MongooseSchema, SchemaTypes} from 'mongoose';
import {Developer} from "../users/developer.schema";
import {Hunter} from "../users/hunter.schema";
import {MessageType} from "../dtos/messages/messageType";
import {FolderType} from "../types/notes/folderType";

export type MailDocument = Mail & Document;

@Schema()
export class Mail {

    @Prop({
        required: true,
        enum: {
            values: [Developer.name, Hunter.name],
            message: 'Please supply a valid user type. Allowed: \'Developer\' or \'Hunter\''
        },
        type: SchemaTypes.String
    })
    receiverRoleReference: 'Developer' | 'Hunter';

    @Prop({
        type: SchemaTypes.ObjectId,
        refPath: 'receiverRoleReference',
        required: true
    })
    receiverId: string;

    @Prop({
        type: SchemaTypes.String,
        refPath: [Developer.name, Hunter.name],
        required: true
    })
    senderId: string;

    @Prop({required: true})
    content: string;

    @Prop({required: true})
    title: string;

    @Prop({required: true, default: new Date()})
    sendTime: Date;

    @Prop({required: true, default: false})
    isRead: boolean;

    @Prop({required: true, default: MessageType.MESSAGE})
    type: MessageType;

    @Prop({required: false, default: FolderType.INBOX})
    receiverBelongFolder: FolderType = FolderType.INBOX;

    @Prop({required: false, default: FolderType.SEND})
    senderBelongFolder: FolderType = FolderType.SEND;

}

export const MailSchema = SchemaFactory.createForClass(Mail);
