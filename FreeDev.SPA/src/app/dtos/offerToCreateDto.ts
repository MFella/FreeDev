export interface OfferToCreateDto {
  title: string;
  description: string;
  tags: Array<string>;
  salary: number;
  originCurrency: string;
  expirenceLevel: ExperienceLevel;
}

export enum ExperienceLevel {
  ENTRY = 'ENTRY',
  JUNIOR = 'JUNIOR',
  MID = 'MID',
  SENIOR = 'SENIOR',
  EXPERT = 'EXPERT',
}
