import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Developer } from 'src/users/developer.schema';
import { Hunter } from 'src/users/hunter.schema';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({ required: true })
  type: string;

  @Prop({ required: false })
  content?: string;

  @Prop({ required: false })
  title?: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: false,
    ref: Hunter.name || Developer.name,
  })
  sender: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: false,
    ref: Hunter.name || Developer.name,
  })
  receiver: string;

  @Prop({
    default: new Date(),
    required: true,
  })
  sendTime: Date;

  @Prop({
    required: true,
  })
  isRead: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
