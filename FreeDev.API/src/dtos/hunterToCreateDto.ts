import { IsString, Matches } from "class-validator";
import { UserToCreateDto } from "./userToCreateDto";

export const HUNTER_INPUT_PATTERNS = {
    COMPANY_NAME: /^[0-9A-Za-zÀ-ÿ\s,._+;()*~'#@!?&-]+$/,

}

export class HunterToCreateDto extends UserToCreateDto {

    @IsString()
    @Matches(HUNTER_INPUT_PATTERNS.COMPANY_NAME)
    nameOfCompany?: string;

    @IsString()
    businessOffice?: string;

    @IsString()
    sizeOfCompany?: string;
}
