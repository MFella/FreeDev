import { UserToCreateDto } from "./userToCreateDto";

export interface DeveloperToCreateDto extends UserToCreateDto {

    country?: string;
    city?: string;
    technologies?: string;
    hobbies?: string;
}
