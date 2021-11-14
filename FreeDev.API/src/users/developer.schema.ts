import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Roles } from 'src/types/roles';
import { File } from '../files/file.schema';

export type DeveloperDocument = Developer & Document;

@Schema()
export class Developer {
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
  country: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  technologies: string;

  @Prop({ required: true })
  hobbies: string;

  @Prop({ required: true })
  role: Roles;
}

export const DeveloperSchema = SchemaFactory.createForClass(Developer);
