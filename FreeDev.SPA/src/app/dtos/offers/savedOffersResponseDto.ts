import { SavedOffer } from 'src/app/types/offer/savedOffer';

export interface SavedOffersResponseDto {
  onlyOffers: Array<SavedOffer>;
  numberOfTotalRecords: number;
}
