import { IsEmail, IsString, Matches } from "class-validator";
import { USER_INPUT_PATTERNS } from "./userToCreateDto";

export class UserToLoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @Matches(USER_INPUT_PATTERNS.PASSWORD)
    password: string;
}