import {Roles} from "../roles.enum";

export interface FilteredUserChatListDto {
  friendsOrRequestedFriendsIds: Array<string>;
  numberOfTotalRecords: number;
  result: Array<FilteredUserChatRecord>
}

export interface FilteredUserChatRecord {
  _id: string;
  role: Roles;
  surname: string;
  name: string;
  avatar: FilteredUserCharRecordAvatar;
}

export interface FilteredUserCharRecordAvatar {
  url: string;
}
