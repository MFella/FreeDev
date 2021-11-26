import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserToUpdateDto } from 'src/dtos/userToUpdateDto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SignedFileUrlDto } from 'src/dtos/signedFileUrlDto';
import { UserChatListParamsDto } from 'src/dtos/userChatListParamsDto';
import { UserToMessageListDto } from 'src/dtos/userToMessageListDto';

@Controller('users')
export class UsersController {
  constructor(private readonly userServ: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Put('')
  async updateUserInfo(
    @Req() request,
    @Body() userToUpdateDto: UserToUpdateDto,
    @Query() query: { id: string },
  ): Promise<SignedFileUrlDto> {
    return await this.userServ.updateUserInfo(
      query.id,
      request.user.userId,
      request.user.role,
      userToUpdateDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('users-list')
  async getUserChatList(
    @Query() query: UserChatListParamsDto,
  ): Promise<Array<UserToMessageListDto>> {
    return await this.userServ.getUserChatList(query);
  }
}
