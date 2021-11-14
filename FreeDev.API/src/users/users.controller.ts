import { UsersService } from './users.service';
import { Body, Controller, Put, Req, UseGuards } from '@nestjs/common';
import { UserToUpdateDto } from 'src/dtos/userToUpdateDto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userServ: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Put('')
  async updateUserInfo(
    @Req() request,
    @Body() userToUpdateDto: UserToUpdateDto,
  ): Promise<boolean> {
    console.log(userToUpdateDto);
    return await this.userServ.updateUserInfo(
      request.user.userId,
      request.user.role,
      userToUpdateDto,
    );
  }
}
