import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export const USER_INPUT_PATTERNS =  {
    NAME: /^[A-Za-z]+$/,
    SURNAME: /^[A-Za-z]+$/,
    PASSWORD: /^^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
} 

export class UserToCreateDto {
    @IsString()
    @MinLength(2)
    @Matches(USER_INPUT_PATTERNS.NAME)
    name: string;

    @IsString()
    @MinLength(2)
    @Matches(USER_INPUT_PATTERNS.SURNAME)
    surname: string;

    @IsEmail()
    email: string;

    @IsString()
    @Matches(USER_INPUT_PATTERNS.PASSWORD)
    password: string;

    @IsString()
    bio: string;
}
