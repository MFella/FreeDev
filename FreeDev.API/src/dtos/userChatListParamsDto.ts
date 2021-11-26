import { IsString } from 'class-validator';

export class UserChatListParamsDto {
  @IsString()
  pageNo: string;

  @IsString()
  perPage: string;
}
