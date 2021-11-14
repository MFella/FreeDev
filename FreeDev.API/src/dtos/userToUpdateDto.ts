import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { HUNTER_INPUT_PATTERNS } from './hunterToCreateDto';
import { USER_INPUT_PATTERNS } from './userToCreateDto';

export class UserToUpdateDto {
  @IsString()
  @MinLength(2)
  @Matches(USER_INPUT_PATTERNS.NAME)
  name: string;

  @IsString()
  @MinLength(2)
  @Matches(USER_INPUT_PATTERNS.SURNAME)
  surname: string;

  @IsString()
  bio: string;

  @IsOptional()
  @IsString()
  @Matches(HUNTER_INPUT_PATTERNS.COMPANY_NAME)
  nameOfCompany?: string;

  @IsOptional()
  @IsString()
  businessOffice?: string;

  @IsOptional()
  @IsString()
  sizeOfCompany?: string;

  @IsOptional()
  @MinLength(2)
  @Matches(USER_INPUT_PATTERNS.NAME)
  country: string;

  @IsOptional()
  @MinLength(2)
  @Matches(USER_INPUT_PATTERNS.NAME)
  city: string;

  @IsOptional()
  @IsString()
  technologies?: string;

  @IsOptional()
  @IsString()
  hobbies?: string;

  @IsOptional()
  avatarToUpload: Buffer;

  @IsOptional()
  @IsString()
  avatarName: string | null;
}
