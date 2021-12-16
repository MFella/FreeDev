import { OfferToListDto } from './offerToListDto';

export interface OfferListPayloadDto {
  offers: Array<OfferToListDto>;
  numberOfTotalRecords: number;
  finalMinSalary: number;
  finalMaxSalary: number;
}
