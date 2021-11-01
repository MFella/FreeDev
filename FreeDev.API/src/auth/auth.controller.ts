import { Body, Controller, HttpCode, Injectable, Post, Res } from "@nestjs/common";
import { DeveloperToCreateDto } from "src/dtos/developerToCreateDto";
import { HunterToCreateDto } from "src/dtos/hunterToCreateDto";
import { UserToLoginDto } from "src/dtos/userToLoginDto";
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {

    constructor(
        private readonly userServ: UsersService,
        private readonly authService: AuthService
    ) {}


    @Post('developer')
    @HttpCode(201)
    async createDeveloper(@Body() developerToCreateDto: DeveloperToCreateDto) {
        return await this.userServ.createDeveloper(developerToCreateDto);
    }

    @Post('hunter')
    @HttpCode(201)
    async createHunter(@Body() hunterToCreateDto: HunterToCreateDto) {
        return await this.userServ.createHunter(hunterToCreateDto);
    }

    @Post('login')
    async login(@Body()loginDto: UserToLoginDto, @Res() response): Promise<any> {
        const payloadToReturn = await this.authService.login(loginDto);

        if (payloadToReturn) {
            response.status(200).send(payloadToReturn);
        }
    }
}