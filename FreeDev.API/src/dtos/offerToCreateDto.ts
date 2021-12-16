import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';

export enum ExperienceLevel {
  ENTRY = 'ENTRY',
  JUNIOR = 'JUNIOR',
  MID = 'MID',
  SENIOR = 'SENIOR',
  EXPERT = 'EXPERT',
}

export class OfferToCreateDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString({ each: true })
  tags: Array<string>;

  @IsNumber()
  salary: number;

  @IsEnum(ExperienceLevel)
  experienceLevel: ExperienceLevel;
}
