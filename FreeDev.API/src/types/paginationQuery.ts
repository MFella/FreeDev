import { IsString } from 'class-validator';

export class PaginationQuery {
  @IsString()
  itemsPerPage: string;

  @IsString()
  currentPage: string;
}
