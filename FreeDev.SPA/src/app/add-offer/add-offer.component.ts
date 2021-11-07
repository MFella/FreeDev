import { SelectedBadgeComponent } from './../generics/selected-badge/selected-badge.component';
import { AdDirective } from './../directives/ad.directive';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  Component,
  ComponentFactoryResolver,
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

  icons: Array<IconDefinition> = [faClipboardList];

  constructor(
    private readonly fb: FormBuilder,
    private resolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    this.initForm();
  }

  addOffer(): void {}

  handleAddingNewSkill(): void {
    const skillValue = this.offerForm.get('tags')?.value;

    if (!skillValue) {
      return;
    }

    this.createBandgeComponent(skillValue);

    this.offerForm.get('tags')?.setValue('');
  }

  private initForm() {
    this.offerForm = this.fb.group({
      title: ['', { validators: [Validators.required] }],
      description: [
        '',
        { validators: [Validators.required, Validators.minLength(40)] },
      ],
      tags: ['', { validators: [] }],
      experienceLevel: ['entry', { validators: [Validators.required] }],
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
    const componentRef = this.adPoint.createComponent(factory);
    componentRef.instance.label = label;
  }
}
