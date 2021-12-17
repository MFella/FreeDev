import { OfferDetailsDto } from './../dtos/offers/offerDetailsDto';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotyService } from '../services/noty.service';
import { OfferService } from '../services/offer.service';

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.scss'],
})
export class OfferDetailsComponent implements OnInit {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly offerServ: OfferService,
    private readonly noty: NotyService,
    private readonly router: Router
  ) {}

  offerToDisplay!: OfferDetailsDto;

  ngOnInit(): void {
    this.route.data.subscribe((response: any) => {
      console.log(response);
      this.offerToDisplay = response.offer;
    });
  }

  submitProposal(offerId: string): void {
    this.offerServ.submitProposal(offerId).subscribe(
      () => this.noty.success('Proposal has been sent'),
      (_error: HttpErrorResponse) => this.noty.error('Something went wrong')
    );
  }

  saveOffer(offerId: string): void {
    this.offerServ.saveOffer(offerId).subscribe(
      () => this.noty.success('Offer has been saved'),
      (_error: HttpErrorResponse) => this.noty.error('Something went wrong')
    );
  }

  toUserProfile(userId: string): void {
    this.router.navigate(['profile'], {
      queryParams: { id: userId },
    });
  }
}
