export interface UserToUpdateDto {
  name: string;
  surname: string;
  bio: string;
  sizeOfComapany?: string;
  companyName?: string;
  businessOffice?: string;
  country?: string;
  city?: string;
  technologies?: string;
  hobbies?: string;
  avatarToUpload: any;
  avatarName: string | null;
}
