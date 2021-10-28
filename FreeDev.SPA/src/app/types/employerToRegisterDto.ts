import { BasicUserDataToRegisterDto } from "./basicUserDataToRegisterDto";

export interface EmployerToRegisterDto extends BasicUserDataToRegisterDto{
    companyName: string;
    businessOffice: string;
    sizeOfCompany: SizeOfCompany;
}

export enum SizeOfCompany {
    SMALL = 'SMALL',
    MEDIUM = 'MEDIUM',
    LARGE = 'LARGE'
}