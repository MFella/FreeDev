import { OfferDetailsDto } from './../dtos/offers/offerDetailsDto';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotyService } from '../services/noty.service';
import { OfferService } from '../services/offer.service';
import { AuthService } from '../services/auth.service';

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
    private readonly router: Router,
    private readonly changeDetectorRef: ChangeDetectorRef,
    public readonly authServ: AuthService
  ) {}

  appliedUsers: Array<{ name: string; surname: string; _id: string }> = [];

  offerToDisplay!: OfferDetailsDto;

  isUserAppliedForOffer: boolean = false;

  isUserSavedOffer: boolean = false;

  submitButtonLabel = '';

  saveButtonLabel = '';

  ngOnInit(): void {
    this.route.data.subscribe((response: any) => {
      this.offerToDisplay = response.offer.offerContent;
      this.isUserAppliedForOffer = response.offer.isUserAppliedForOffer;
      this.isUserSavedOffer = response.offer.isUserSavedOffer;
      this.appliedUsers = response.offer?.appliedDevs;
      this.updateButtonLabels();
      this.changeDetectorRef.detectChanges();
    });
  }

  submitProposal(offerId: string): void {
    this.isUserAppliedForOffer = true;
    this.updateButtonLabels();
    this.offerServ.submitProposal(offerId).subscribe(
      () => this.noty.success('Proposal has been sent'),
      (_error: HttpErrorResponse) => this.noty.error('Something went wrong')
    );
  }

  saveOffer(offerId: string): void {
    this.isUserSavedOffer = true;
    this.updateButtonLabels();
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

  private updateButtonLabels(): void {
    this.submitButtonLabel = this.isUserAppliedForOffer
      ? 'Submitted'
      : 'Submit Proposal';

    this.saveButtonLabel = this.isUserSavedOffer ? 'Saved' : 'Save Offer';
  }
}
