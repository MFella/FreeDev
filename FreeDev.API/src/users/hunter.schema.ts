import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Roles } from 'src/types/roles';
import { Document, Schema as MongooseSchema, SchemaTypes } from 'mongoose';
import { File } from '../files/file.schema';
import { Developer } from './developer.schema';

export type HunterDocument = Hunter & Document;

@Schema()
export class Hunter {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  surname: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, type: Buffer })
  passwordHash: Buffer;

  @Prop({ required: true, type: Buffer })
  passwordSalt: Buffer;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: false,
    ref: File.name,
  })
  avatar?: File;

  @Prop({ required: true })
  bio: string;

  @Prop({ required: true })
  nameOfCompany: string;

  @Prop({ required: true })
  businessOffice: string;

  @Prop({ required: true })
  sizeOfCompany: string;

  @Prop({ required: true })
  role: Roles;

  @Prop({
    type: [SchemaTypes.String],
    ref: Developer.name || Hunter.name,
  })
  contacts: Array<Developer | Hunter>;
}

export const HunterSchema = SchemaFactory.createForClass(Hunter);
