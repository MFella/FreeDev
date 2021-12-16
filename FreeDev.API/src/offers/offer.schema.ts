import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Developer } from 'src/users/developer.schema';
import { Hunter } from 'src/users/hunter.schema';

export type OfferDocument = Offer & Document;

@Schema()
export class Offer {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  tags: Array<string>;

  @Prop({ required: true })
  salary: number;

  @Prop({ required: true })
  experienceLevel: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: Hunter.name })
  createdBy: Types.ObjectId;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;

  @Prop({ type: [SchemaTypes.ObjectId], ref: Developer.name })
  appliedDevelopers: Array<Types.ObjectId>;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);
