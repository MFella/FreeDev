import { IsString } from 'class-validator';

export class FoldersStructureQuery {
  @IsString()
  receiverId: string;
}
