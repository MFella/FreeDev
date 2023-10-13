import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type WebSocketMessageDocument = WebSocketMessage & Document;

@Schema()
export class WebSocketMessage {
  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  receiver: string;

  @Prop({ required: true, default: new Date() })
  sendTime: Date;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  key: string;

  @Prop({
    required: false,
    type: MongooseSchema.Types.ObjectId,
    ref: WebSocketMessage.name,
  })
  replyMessage: string;
}

export const WebSocketMessageSchema =
  SchemaFactory.createForClass(WebSocketMessage);
