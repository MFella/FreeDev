import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Schema as MongooseSchema, SchemaTypes} from 'mongoose';
import {Developer} from "../users/developer.schema";
import {Hunter} from "../users/hunter.schema";
import {MessageType} from "../dtos/messages/messageType";

export type MailDocument = Mail & Document;

@Schema()
export class Mail {
    @Prop({
        type: SchemaTypes.String,
        ref: Developer.name || Hunter.name,
        required: true
    })
    receiverId: string;

    @Prop({
        type: SchemaTypes.String,
        ref: Developer.name || Hunter.name,
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
}

export const MailSchema = SchemaFactory.createForClass(Mail);
