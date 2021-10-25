import { Body, Controller, Post } from "@nestjs/common";
import { UsersService } from "./users.service";


@Controller('users')
export class UsersController {

    constructor(private readonly userServ: UsersService) {}


    @Post('developer')
    async createDeveloper(@Body() someBody: any) {
        console.log('co jest');
        await this.userServ.createDeveloper();
    }
}