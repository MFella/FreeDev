import { Body, Controller, Post } from "@nestjs/common";
import { DeveloperToCreateDto } from "src/dtos/developerToCreateDto";
import { HunterToCreateDto } from "src/dtos/hunterToCreateDto";
import { UsersService } from "./users.service";


@Controller('users')
export class UsersController {

    constructor(private readonly userServ: UsersService) {}

    @Post('developer')
    async createDeveloper(@Body() developerToCreateDto: DeveloperToCreateDto) {
        await this.userServ.createDeveloper(developerToCreateDto);
    }

    @Post('hunter')
    async createHunter(@Body() hunterToCreateDto: HunterToCreateDto) {
        await this.userServ.createHunter(hunterToCreateDto);
    }
}