import { IsArray, IsOptional, IsString } from 'class-validator';

export class PaginationWithFiltersQuery {
  @IsString()
  itemsPerPage: string;

  @IsString()
  currentPage: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: Array<string> = [];

  @IsString({ each: true })
  salaryRange: Array<string> = [];

  @IsOptional()
  @IsString()
  period: string;

  @IsOptional()
  @IsString()
  entryLevel: string;
}
