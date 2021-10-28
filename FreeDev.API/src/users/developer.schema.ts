import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


export type DeveloperDocument = Developer & Document;

@Schema()
export class Developer {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    surname: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;

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
}

export const DeveloperSchema = SchemaFactory.createForClass(Developer);