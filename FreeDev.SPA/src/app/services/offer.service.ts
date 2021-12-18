import { SavedOffer } from './../types/offer/savedOffer';
import { OfferToCreateDto } from './../dtos/offerToCreateDto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { OfferToListDto } from '../dtos/offers/offerToListDto';
import { OFFER_PERIOD } from '../types/offer/offerPeriod';
import { OFFER_ENTRY_LEVEL } from '../types/offer/offerEntryLevel';
import { OfferListPayloadDto } from '../dtos/offers/offerListPayloadDto';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  constructor(private http: HttpClient) {}

  addOffer(offerToCreateDto: OfferToCreateDto): Observable<boolean> {
    return this.http.post<boolean>(
      this.getRestUrl() + 'offer',
      offerToCreateDto
    );
  }

  getOfferDetail(offerId: string): Observable<any> {
    return this.http.get<any>(
      this.getRestUrl() + `offer/details?id=${offerId}`
    );
  }

  getOfferList(
    tags: Array<string> = [],
    salaryRange: Array<number> = [],
    period: OFFER_PERIOD = OFFER_PERIOD.ANY,
    entryLevel: OFFER_ENTRY_LEVEL = OFFER_ENTRY_LEVEL.ANY,
    itemsPerPage: string = '2',
    currentPage: string = '0'
  ): Observable<OfferListPayloadDto> {
    const tagsQuery = new URLSearchParams();
    const salaryQuery = new URLSearchParams();

    tagsQuery.append('tags[]', '');
    salaryQuery.append('salaryRange[]', '');

    tags.forEach((tag: string) => {
      tagsQuery.append('tags[]', tag);
    });

    salaryRange.forEach((salary: number) => {
      salaryQuery.append('salaryRange[]', salary.toString());
    });

    return this.http.get<OfferListPayloadDto>(
      this.getRestUrl() +
        `offer/list?${tagsQuery}&${salaryQuery}&period=${period}&entryLevel=${entryLevel}&itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`
    );
  }

  getSavedOffers(
    itemsPerPage: string,
    currentPage: string
  ): Observable<Array<SavedOffer>> {
    return this.http.get<Array<SavedOffer>>(
      this.getRestUrl() +
        `offer/saved?itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`
    );
  }

  submitProposal(offerId: string): Observable<void> {
    return this.http.put<void>(
      this.getRestUrl() + `offer/submit-proposal?offerId=${offerId}`,
      {}
    );
  }

  saveOffer(offerId: string): Observable<void> {
    return this.http.put<void>(
      this.getRestUrl() + `offer/save?offerId=${offerId}`,
      {}
    );
  }

  private getRestUrl(): string {
    return env.backendUrl;
  }
}
