import { IsString } from 'class-validator';

export class PaginationQuery {
  @IsString()
  searchPhrase: string;

  @IsString({ each: true })
  date: Array<string>;

  @IsString()
  itemsPerPage: string;

  @IsString()
  currentPage: string;
}
