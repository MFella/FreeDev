import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, SchemaTypes } from 'mongoose';
import { Offer } from 'src/offers/offer.schema';
import { Roles } from 'src/types/roles';
import { File } from '../files/file.schema';
import { Hunter } from './hunter.schema';

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

  @Prop({ default: '' })
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

  @Prop({ type: [SchemaTypes.String], ref: Offer.name })
  favouriteOffers: Array<string>;

  @Prop({
    type: [SchemaTypes.String],
    ref: Developer.name || Hunter.name,
  })
  contacts: Array<Developer | Hunter>;
}

export const DeveloperSchema = SchemaFactory.createForClass(Developer);
