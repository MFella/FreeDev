import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Developer, DeveloperDocument } from "./developer.schema";
import { Hunter, HunterDocument } from "./hunter.schema";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(Developer.name) private developerModel: Model<DeveloperDocument>,
        @InjectModel(Hunter.name) private hunterModel: Model<HunterDocument>) {}

    async createDeveloper(): Promise<any> {
        this.developerModel.create({});
    }
}