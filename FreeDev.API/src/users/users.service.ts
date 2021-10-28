import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DeveloperToCreateDto } from "src/dtos/developerToCreateDto";
import { HunterToCreateDto } from "src/dtos/hunterToCreateDto";
import { Developer, DeveloperDocument } from "./developer.schema";
import { Hunter, HunterDocument } from "./hunter.schema";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(Developer.name) private developerModel: Model<DeveloperDocument>,
        @InjectModel(Hunter.name) private hunterModel: Model<HunterDocument>) {}

    async createDeveloper(developerToCreateDto: DeveloperToCreateDto): Promise<any> {
        try {

        } catch(e) {
            throw new InternalServerErrorException('Problem occured during saving developer. Try again in couple of minutes');
        }
        this.developerModel.create(developerToCreateDto);
    }

    async createHunter(hunterToCreateDto: HunterToCreateDto): Promise<any> {
        try {
            this.hunterModel.create(hunterToCreateDto);

        } catch(e) {
            throw new InternalServerErrorException('Problem occured during saving developer. Try again in couple of minutes');
        }
    }
}