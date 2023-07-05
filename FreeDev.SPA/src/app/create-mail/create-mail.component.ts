import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { KindOfMailDropdownItem } from '../types/mail/kindOfMailDropdownItem';
import { MailService } from '../services/mail.service';
import { MailMessageToSend } from '../types/mail/mailMessageToSend';
import { take } from 'rxjs/operators';
import { NotyService } from '../services/noty.service';
import { DirectMessageToSendDto } from '../types/message/directMessageToSendDto';
import { IndirectMessageToSendDto } from '../types/message/indirectMessageToSendDto';

export enum FormInputKeys {
  RECEIVER = 'receiver',
  TITLE = 'title',
  CONTENT = 'content',
  KIND_OF_MESSAGE = 'kind-of-message',
}

export enum KindOfMail {
  INVITATION = 'INVITATION',
  DELETION = 'DELETION',
  MESSAGE = 'MESSAGE',
}

@Component({
  selector: 'create-mail',
  templateUrl: './create-mail.component.html',
  styleUrls: ['./create-mail.component.scss'],
})
export class CreateMailComponent implements OnInit {
  formInputKeys: typeof FormInputKeys = FormInputKeys;

  private static readonly EMAIL_PATTERN =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  private static readonly INVITATION_MESSAGE =
    'Hi, I wanna be your friend. Cheers!';
  private static readonly DELETION_MESSAGE =
    "Hi, I don't wanna be your friend anymore. Cya!";
  private static readonly CONTENT_FIELD_MIN_LENGTH = 20;

  mailForm!: FormGroup;

  kindsOfMail: Array<KindOfMailDropdownItem> = [];

  constructor(
    private readonly mailService: MailService,
    private readonly noty: NotyService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  getReceiverTooltipValidationMessage(): string {
    let validationMessage = '';
    const receiverFormControl = this.mailForm.get(FormInputKeys.RECEIVER);
    if (receiverFormControl?.errors?.required) {
      validationMessage +=
        FormInputKeys.RECEIVER[0].toUpperCase() +
        FormInputKeys.RECEIVER.slice(1) +
        ' is required';
    }

    if (receiverFormControl?.errors?.pattern) {
      validationMessage += 'Pattern of email is inappropriate';
    }
    return validationMessage;
  }

  getContentTooltipValidationMessage(): string {
    let validationMessage = '';
    const contentFormControl = this.mailForm.get(FormInputKeys.CONTENT);
    if (contentFormControl?.errors?.required) {
      validationMessage +=
        FormInputKeys.CONTENT[0].toUpperCase() +
        FormInputKeys.CONTENT.slice(1) +
        ' is required';
    }

    if (contentFormControl?.errors?.minLength) {
      validationMessage +=
        'This field should be longer than ' +
        CreateMailComponent.CONTENT_FIELD_MIN_LENGTH +
        ' characters';
    }
    return validationMessage;
  }

  getTitleTooltipValidationMessage(): string {
    let validationMessage = '';
    const titleFormControl = this.mailForm.get(FormInputKeys.TITLE);
    if (titleFormControl?.errors?.required) {
      validationMessage +=
        FormInputKeys.TITLE[0].toUpperCase() +
        FormInputKeys.TITLE.slice(1) +
        ' is required';
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

  selectedKindOfMailChanged(selectedKindOfMail: KindOfMailDropdownItem): void {
    this.mailForm
      .get(FormInputKeys.KIND_OF_MESSAGE)
      ?.setValue(selectedKindOfMail);
    if (selectedKindOfMail.getKindOfMail() === KindOfMail.DELETION) {
      this.mailForm
        .get(FormInputKeys.CONTENT)
        ?.setValue(CreateMailComponent.DELETION_MESSAGE);
    }

    if (selectedKindOfMail.getKindOfMail() === KindOfMail.INVITATION) {
      this.mailForm
        .get(FormInputKeys.CONTENT)
        ?.setValue(CreateMailComponent.INVITATION_MESSAGE);
    }

    if (selectedKindOfMail.getKindOfMail() === KindOfMail.MESSAGE) {
      this.mailForm.get(FormInputKeys.CONTENT)?.setValue('');
    }
  }

  isKindOfJustMessage(): boolean {
    return (
      this.mailForm.get(FormInputKeys.KIND_OF_MESSAGE)?.value ===
      this.kindsOfMail[0]
    );
  }

  sendMailMessage(): void {
    this.mailService
      .sendIndirectMailMessage(this.getIndirectMessageToSendDto())
      .pipe(take(1))
      .subscribe((saved: boolean) => {
        if (saved) {
          this.clearForm();
          this.noty.success('Your message has been send');
        }
      });
  }

  private initForm(): void {
    this.kindsOfMail = [
      new KindOfMailDropdownItem('Just message', KindOfMail.MESSAGE),
      new KindOfMailDropdownItem('Invitation', KindOfMail.INVITATION),
      new KindOfMailDropdownItem('Deletion', KindOfMail.DELETION),
    ];

    this.mailForm = new FormGroup({
      [FormInputKeys.RECEIVER]: new FormControl('', [
        Validators.required,
        Validators.pattern(CreateMailComponent.EMAIL_PATTERN),
      ]),
      [FormInputKeys.TITLE]: new FormControl('', [Validators.required]),
      [FormInputKeys.CONTENT]: new FormControl('', [
        Validators.required,
        Validators.minLength(CreateMailComponent.CONTENT_FIELD_MIN_LENGTH),
      ]),
      [FormInputKeys.KIND_OF_MESSAGE]: new FormControl(this.kindsOfMail[0]),
    });
  }

  private clearForm(): void {
    this.mailForm.reset();
  }

  private getIndirectMessageToSendDto(): IndirectMessageToSendDto {
    const mailFormValue = { ...this.mailForm.getRawValue() };
    return new IndirectMessageToSendDto(
      mailFormValue[FormInputKeys.RECEIVER],
      mailFormValue[FormInputKeys.KIND_OF_MESSAGE],
      mailFormValue[FormInputKeys.TITLE],
      mailFormValue[FormInputKeys.CONTENT]
    );
  }
}
