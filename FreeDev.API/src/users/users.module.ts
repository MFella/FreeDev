import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Developer, DeveloperSchema } from "./developer.schema";
import { Hunter, HunterSchema } from "./hunter.schema";
import { UsersController } from "./users.controller";
import {UsersService} from './users.service';


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Developer.name, schema: DeveloperSchema },
            { name: Hunter.name, schema: HunterSchema }
            ])],
    controllers: [UsersController],
    providers: [UsersService]
})
export class UsersModule {} 