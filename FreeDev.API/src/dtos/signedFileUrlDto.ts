import { IsString } from 'class-validator';

export class SignedFileUrlDto {
  @IsString()
  signedFileUrl: string;
}
