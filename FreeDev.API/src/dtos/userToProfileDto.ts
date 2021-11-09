import { Roles } from './../types/roles';
export class UserToProfileDto {
  name: string;
  surname: string;
  email: string;
  role: Roles;
  bio: string;
  amIOwner: boolean;
  nameOfCompany?: string;
  businessOffice?: string;
  sizeOfCompany?: string;
  city?: string;
  country?: string;
  technologies?: string;
  hobbies?: string;
}
