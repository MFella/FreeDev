import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotyService } from './../services/noty.service';
import { OfferService } from './../services/offer.service';
import { OfferToCreateDto } from './../dtos/offerToCreateDto';
import { SelectedBadgeComponent } from './../generics/selected-badge/selected-badge.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnInit,
} from '@angular/core';
import {
  faClipboardList,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.scss'],
})
export class AddOfferComponent implements OnInit {
  experienceLevels: Array<{ level: string }> = [
    { level: 'ENTRY' },
    { level: 'JUNIOR' },
    { level: 'MID' },
    { level: 'SENIOR' },
    { level: 'EXPERT' },
  ];

  offerForm!: FormGroup;

  selectedBadgesComponentRef: Array<ComponentRef<SelectedBadgeComponent>> = [];

  storedBadgesLabels: Map<string, ComponentRef<SelectedBadgeComponent>> =
    new Map();

  icons: Array<IconDefinition> = [faClipboardList];

  constructor(
    private readonly fb: FormBuilder,
    private readonly resolver: ComponentFactoryResolver,
    private readonly offerService: OfferService,
    private readonly noty: NotyService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  onBlur(): void {
    console.log(this.offerForm.getRawValue());
  }

  addOffer(): void {
    const { skills, experienceLevel, ...rest } = this.offerForm.getRawValue();

    const offerToCreateDto: OfferToCreateDto = {
      tags: skills,
      experienceLevel: experienceLevel.level,
      ...rest,
    };

    this.offerService.addOffer(offerToCreateDto).subscribe(
      (response: boolean) => {
        this.noty.success('Offer has been added');
        this.router.navigate(['']);
      },
      (error: HttpErrorResponse) => {
        this.noty.error(error.error.message);
      }
    );
  }

  handleLeave() {
    this.noty.confirm('Are you sure you wanna leave?');
  }

  private initForm() {
    this.offerForm = this.fb.group({
      title: [
        '',
        { validators: [Validators.required, Validators.minLength(5)] },
      ],
      description: [
        '',
        { validators: [Validators.required, Validators.minLength(40)] },
      ],
      tags: ['', { validators: [] }],
      experienceLevel: ['ENTRY', { validators: [Validators.required] }],
      salary: [
        5,
        {
          validators: [
            Validators.required,
            Validators.pattern(/^-?\d*[.,]?\d{0,2}$/),
            Validators.min(5),
          ],
        },
      ],
    });
  }
}
