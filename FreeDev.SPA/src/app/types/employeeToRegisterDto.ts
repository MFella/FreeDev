import { BasicUserDataToRegisterDto } from "./basicUserDataToRegisterDto";

export interface EmployeeToRegisterDto extends BasicUserDataToRegisterDto {
    country: string;
    city: string;
    technologies: string;
    hobbies: string;
}
