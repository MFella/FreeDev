export interface UserToMessageListDto {
  _id: string;
  avatar?: { _id: string; url: string };
  name: string;
  surname: string;
  isActive?: boolean;
  lastTimeActive?: string;
}
