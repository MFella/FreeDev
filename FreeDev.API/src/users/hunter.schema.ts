import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Roles } from "src/types/roles";


export type HunterDocument = Hunter & Document;

@Schema()
export class Hunter {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    surname: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    repeatPassword: string;

    @Prop({ required: true })
    bio: string;

    @Prop({ required: true })
    nameOfCompany: string;

    @Prop({ required: true })
    businessOffice: string;

    @Prop({ required: true })
    sizeOfCompany: number;

    @Prop({ required: true })
    role: Roles;
}

export const HunterSchema = SchemaFactory.createForClass(Hunter);