import { Roles } from 'src/app/types/roles.enum';

export interface UserToProfileDto {
  name: string;
  surname: string;
  email: string;
  role: Roles;
  amIOwner: boolean;
  bio: string;
  avatarUrl: string;
  nameOfCompany?: string;
  businessOffice?: string;
  sizeOfCompany?: string;
  city?: string;
  country?: string;
  technologies?: string;
  hobbies?: string;
}
