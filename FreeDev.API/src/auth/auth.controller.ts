import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AvailabilityOfEmailQuery } from 'src/dtos/availabilityOfEmailQuery';
import { DeveloperToCreateDto } from 'src/dtos/developerToCreateDto';
import { HunterToCreateDto } from 'src/dtos/hunterToCreateDto';
import { UserToLoginDto } from 'src/dtos/userToLoginDto';
import { UserToProfileDto } from 'src/dtos/userToProfileDto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userServ: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('check-email')
  async checkAvailabilityOfEmail(
    @Query() query: AvailabilityOfEmailQuery,
  ): Promise<boolean> {
    return await this.userServ.isUserAlreadyExists(query.email);
  }

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
  async login(@Body() loginDto: UserToLoginDto, @Res() response): Promise<any> {
    const payloadToReturn = await this.authService.login(loginDto);

    if (payloadToReturn) {
      response.status(200).send(payloadToReturn);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/:id')
  async getUserProfile(
    @Req() request,
    @Param('id') id,
  ): Promise<UserToProfileDto> {
    console.log(id);
    return await this.userServ.getUserProfile(id, request?.user);
  }
}
