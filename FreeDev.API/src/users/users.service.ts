import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DeveloperToCreateDto } from "src/dtos/developerToCreateDto";
import { HunterToCreateDto } from "src/dtos/hunterToCreateDto";
import { Developer, DeveloperDocument } from "./developer.schema";
import { Hunter, HunterDocument } from "./hunter.schema";
import * as bcrypt from 'bcrypt';
import { Roles } from "src/types/roles";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(Developer.name) private developerModel: Model<DeveloperDocument>,
        @InjectModel(Hunter.name) private hunterModel: Model<HunterDocument>) {}

    async createDeveloper(developerToCreateDto: DeveloperToCreateDto): Promise<boolean> {
        try {
            const {password, ...restOfDto} = developerToCreateDto;
            const passwordSalt = bcrypt.genSaltSync(10);
            const passwordHash = bcrypt.hashSync(password, passwordSalt);

            const developerToCreate = {
                passwordHash,
                passwordSalt,
                role: Roles.DEVELOPER,
                ...restOfDto
            };

            const response = await this.developerModel.create(developerToCreate);

            if (response) return true;

        } catch(e) {
            throw new InternalServerErrorException('Problem occured during saving developer. Try again in couple of minutes');
        }
    }

    async createHunter(hunterToCreateDto: HunterToCreateDto): Promise<boolean> {
        try {
            const {password, ...restOfDto} = hunterToCreateDto;
            const passwordSalt = bcrypt.genSaltSync(10);
            const passwordHash = bcrypt.hashSync(password, passwordSalt);

            const hunterToCreate = {
                passwordHash,
                passwordSalt,
                role: Roles.HUNTER,
                ...restOfDto
            };

            const response = await this.hunterModel.create(hunterToCreate);
            if (response) return true;
        } catch(e) {
            throw new InternalServerErrorException('Problem occured during saving developer. Try again in couple of minutes');
        }
    }

    async findUser(email: string): Promise<any> {

        const hipoDeveloper = await (await this.developerModel.findOne({email}).exec())?.toObject();
        
        if (hipoDeveloper) return hipoDeveloper;

        const hipoHunter = (await this.hunterModel.findOne({email}).exec())?.toObject();

        if (hipoHunter) return hipoHunter;

        return {};
    }
}