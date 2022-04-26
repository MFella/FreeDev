import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
}

export const WebSocketMessageSchema =
  SchemaFactory.createForClass(WebSocketMessage);
