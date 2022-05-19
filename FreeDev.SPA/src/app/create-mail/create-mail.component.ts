import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

export enum FormInputKeys {
  RECEIVER = 'receiver',
  TITLE = 'title',
  CONTENT = 'content'
}

@Component({
  selector: 'create-mail',
  templateUrl: './create-mail.component.html',
  styleUrls: ['./create-mail.component.scss']
})
export class CreateMailComponent implements OnInit {

  private static readonly EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  mailForm!: FormGroup;

  constructor() {
  }

  ngOnInit(): void {
    this.initForm();
  }

  sendMailMessage(): void {
    console.log('sended', this.mailForm);
  }

  getTooltipValidationMessage(): string {
    let validationMessage = '';
    for (const key of Object.keys(this.mailForm.controls)) {
      const formControl = this.mailForm.get(key);
      if (formControl?.errors?.required) {
        validationMessage += key[0].toLocaleUpperCase() + key.slice(1) + ' is required; ';
      }
    }
    return validationMessage;
  }

  getInvalidInputClasses(formInputKey: string): Array<string> {
    const formControl = this.mailForm.get(formInputKey);

    if (formControl?.invalid && formControl.touched) {
      return ['ng-invalid', 'ng-dirty'];
    }

    return [];
  }

  private initForm(): void {
    this.mailForm = new FormGroup({
      [FormInputKeys.RECEIVER]: new FormControl('', [Validators.required,
        Validators.pattern(CreateMailComponent.EMAIL_PATTERN)]),
      [FormInputKeys.TITLE]: new FormControl('', [Validators.required]),
      [FormInputKeys.CONTENT]: new FormControl('', [Validators.required, Validators.minLength(20)])
    })
  }
}
