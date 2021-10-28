import { UserToCreateDto } from "./userToCreateDto";

export interface HunterToCreateDto extends UserToCreateDto {

    nameOfCompany?: string;
    businessOffice?: string;
    sizeOfCompany?: string;
}
