import { EmployeeToRegisterDto } from "../types/employeeToRegisterDto";
import { EmployerToRegisterDto } from "../types/employerToRegisterDto";

export class ContractConverter {


    static convertEmployeeToRegisterDto(rawEmployeeToRegisterDto: any): EmployeeToRegisterDto {

        const employeeToRegisterDto: EmployeeToRegisterDto = {
            name: rawEmployeeToRegisterDto.name,
            surname: rawEmployeeToRegisterDto.surname,
            email: rawEmployeeToRegisterDto.email,
            password: rawEmployeeToRegisterDto.password,
            bio: rawEmployeeToRegisterDto.bio,
            country: rawEmployeeToRegisterDto.originCountry,
            city: rawEmployeeToRegisterDto.originCity,
            technologies: rawEmployeeToRegisterDto.technologies,
            hobbies: rawEmployeeToRegisterDto.hobbies
        };

        return employeeToRegisterDto;

    }

    static convertEmployerToRegisterDto(rawEmployerToRegisterData: any): EmployerToRegisterDto {

        const employeeToRegisterDto: EmployerToRegisterDto = {
            name: rawEmployerToRegisterData.name,
            surname: rawEmployerToRegisterData.surname,
            email: rawEmployerToRegisterData.email,
            password: rawEmployerToRegisterData.password,
            bio: rawEmployerToRegisterData.bio,
            companyName: rawEmployerToRegisterData.companyName,
            businessOffice: rawEmployerToRegisterData.businessOffice,
            sizeOfCompany: rawEmployerToRegisterData.sizeOfCompany
        };

        return employeeToRegisterDto;
    }
}