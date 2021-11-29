import { Pagination } from 'src/app/types/pagination';
import { UserToMessageListDto } from './userToMessageListDto';

export interface ResolvedMessagePageInfo {
  pagination: Pagination;
  userRoomList: Array<UserToMessageListDto>;
}
