import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Developer, DeveloperSchema } from "./developer.schema";
import { Hunter, HunterSchema } from "./hunter.schema";
import {UsersService} from './users.service';


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Developer.name, schema: DeveloperSchema },
            { name: Hunter.name, schema: HunterSchema }
            ])],
    providers: [UsersService]
})
export class UsersModule {} 