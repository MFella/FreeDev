import { OfferToCreateDto } from './../dtos/offerToCreateDto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { OfferToListDto } from '../dtos/offers/offerToListDto';

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
    tags: Array<string>,
    salaryRange: Array<number>,
    period: string,
    entryLevel: string,
    itemsPerPage: string = '2',
    currentPage: string = '0'
  ): Observable<Array<OfferToListDto>> {
    const tagsQuery = new URLSearchParams();
    const salaryQuery = new URLSearchParams();
    tags.forEach((tag: string) => {
      tagsQuery.append('tags[]', tag);
    });

    salaryRange.forEach((salary: number) => {
      salaryQuery.append('salaryRange', salary.toString());
    });

    return this.http.get<Array<OfferToListDto>>(
      this.getRestUrl() +
        `offer/list?${tagsQuery}&${salaryQuery}&period=${period}&entryLevel=${entryLevel}&itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`
    );
  }

  private getRestUrl(): string {
    return env.backendUrl;
  }
}
