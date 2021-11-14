import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type FileDocument = File & Document;

@Schema()
export class File {
  @Prop({ required: true })
  url: string;

  @Prop({ reuqired: true })
  key: string;

  @Prop({ required: true })
  type: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
