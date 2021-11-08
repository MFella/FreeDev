import { OfferToCreateDto } from './../dtos/offerToCreateDto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { Observable } from 'rxjs';

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

  private getRestUrl(): string {
    return env.backendUrl;
  }
}
