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
import { request } from 'http';

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
  ): Promise<{ result: Array<any>; numberOfTotalRecords: number }> {
    return await this.userServ.getUserChatList(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('filtered-users-list')
  async getFilteredUserChatList(
    @Req() request,
    @Query() query: any,
  ): Promise<{ result: Array<any>; numberOfTotalRecords: number }> {
    return await this.userServ.getFilteredUserChatList(
      request.user.userId,
      query,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-key-room')
  async getUserKeyRoom(@Req() request, @Query() query: { _id: string }) {
    console.log(request.user);
    console.log(query);
    return await this.userServ.getUserKeyRoom(
      request.user.userId.toString(),
      query._id,
    );
  }
}
