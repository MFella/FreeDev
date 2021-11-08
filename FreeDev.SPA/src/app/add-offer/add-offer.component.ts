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
  ViewChild,
  ViewContainerRef,
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
  @ViewChild('skillInputRef', { read: ViewContainerRef })
  adPoint!: ViewContainerRef;

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

  handleAddingNewSkill(): void {
    const skillValue = this.offerForm.get('tags')?.value.trim();

    if (!skillValue) {
      this.offerForm.get('tags')?.setValue('');
      return;
    }

    this.createBandgeComponent(skillValue);

    this.offerForm.get('tags')?.setValue('');
  }

  addOffer(): void {
    const { skills, ...rest } = this.offerForm.getRawValue();
    const tags: Array<string> = this.selectedBadgesComponentRef.map(
      (component: ComponentRef<SelectedBadgeComponent>) =>
        component.instance.label
    );

    const offerToCreateDto: OfferToCreateDto = {
      tags,
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
        '',
        {
          validators: [
            Validators.required,
            Validators.pattern(/^-?\d*[.,]?\d{0,2}$/),
          ],
        },
      ],
    });
  }

  private createBandgeComponent(label: string) {
    const factory = this.resolver.resolveComponentFactory(
      SelectedBadgeComponent
    );

    const componentRef: ComponentRef<SelectedBadgeComponent> =
      this.adPoint.createComponent(factory);
    const uniqueId = getUniqueId(5);

    componentRef.instance.label = label;
    componentRef.instance.id = uniqueId;

    this.storedBadgesLabels.set(uniqueId, componentRef);

    this.selectedBadgesComponentRef.push(componentRef);

    componentRef.instance.deleteAction$.subscribe((id: string) => {
      this.storedBadgesLabels.get(id)?.destroy();
    });
  }
}

export const getUniqueId = (parts: number): string => {
  const stringArr = [];
  for (let i = 0; i < parts; i++) {
    // tslint:disable-next-line:no-bitwise
    const S4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    stringArr.push(S4);
  }
  return stringArr.join('-');
};
