import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type RoomKeyDocument = RoomKey & Document;

@Schema()
export class RoomKey {
  @Prop({ required: true })
  userIds: Array<string>;

  @Prop({ required: true })
  key: string;
}

export const RoomKeySchema = SchemaFactory.createForClass(RoomKey);
