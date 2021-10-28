import { IsString, Matches, MinLength } from "class-validator";
import { UserToCreateDto, USER_INPUT_PATTERNS } from "./userToCreateDto";

export class DeveloperToCreateDto extends UserToCreateDto {

    @MinLength(2)
    @Matches(USER_INPUT_PATTERNS.NAME)
    country: string;

    @MinLength(2)
    @Matches(USER_INPUT_PATTERNS.NAME)
    city: string;

    @IsString()
    technologies?: string;

    @IsString()
    hobbies?: string;
}
