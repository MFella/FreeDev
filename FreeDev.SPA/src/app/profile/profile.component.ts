import { Roles } from '../types/roles.enum';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import {
  faEdit,
  faSave,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Data } from '@angular/router';
import { UserToProfileDto } from '../dtos/userToProfileDto';
import { UsersService } from '../services/users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotyService } from '../services/noty.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;

  avatarToUpload: File | null = null;

  isReadonly: boolean = true;

  userProfile!: UserToProfileDto;

  editMode: boolean = false;

  temporaryEditData!: any;

  icons: Array<IconDefinition> = [faEdit, faSave, faTimesCircle];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly userServ: UsersService,
    private readonly noty: NotyService,
    private readonly sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.route.data.subscribe((response: Data) => {
      this.userProfile = response.profile;
      if (!response.profile) {
        return;
      }

      if (response.profile.role === Roles.HUNTER) {
        this.initFormForHunter();
      }

      if (response.profile.role === Roles.DEVELOPER) {
        this.initFormForDeveloper();
      }
    });
  }

  async updateUserInfo(): Promise<void> {
    const arrayBuffer = await this.avatarToUpload?.arrayBuffer();
    this.userServ
      .updateUserInfo({
        avatarName: this.avatarToUpload?.name,
        avatarToUpload: Buffer.from(arrayBuffer ?? ''),
        ...this.profileForm.getRawValue(),
      })
      .subscribe(
        (response: boolean) => {
          if (response) {
            this.isReadonly = !this.isReadonly;
          } else {
            this.noty.error('Couldnt save your data');
          }
        },
        (error: HttpErrorResponse) => this.noty.error(error.error.message)
      );
  }

  setAvatarToUpload($event: Event): void {
    const avatarToUpload: FileList | null = ($event?.target as HTMLInputElement)
      ?.files;
    if (!avatarToUpload) {
      this.avatarToUpload = avatarToUpload;
    } else {
      this.avatarToUpload = avatarToUpload[0];
    }

    console.log('asdasd', this.profileForm.get('avatarBinding'));
  }

  cancelEditMode(): void {
    this.profileForm.setValue(this.temporaryEditData);
    this.avatarToUpload = null;
    this.isReadonly = !this.isReadonly;
  }

  setEditMode(): void {
    this.temporaryEditData = this.profileForm.getRawValue();
    this.isReadonly = !this.isReadonly;
  }

  private initFormForDeveloper(): void {
    this.profileForm = this.fb.group({
      name: [
        this.userProfile.name,
        {
          validators: [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern(/^[A-Za-z]+$/),
          ],
        },
      ],
      surname: [
        this.userProfile.surname,
        {
          validators: [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern(/^[A-Za-z]+$/),
          ],
        },
      ],
      email: [
        this.userProfile.email,
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/),
        ],
      ],
      bio: [this.userProfile.bio, { validators: [] }],
      city: [
        this.userProfile.city,
        {
          validators: [
            Validators.minLength(2),
            Validators.pattern(/^[A-Za-z]+$/),
          ],
        },
      ],
      country: [
        this.userProfile.country,
        {
          validators: [
            Validators.minLength(2),
            Validators.pattern(/^[A-Za-z]+$/),
          ],
        },
      ],
      technologies: [this.userProfile.technologies, { validators: [] }],
      hobbies: [this.userProfile.hobbies, { validators: [] }],
      avatarBinding: [],
    });
  }

  private initFormForHunter(): void {
    this.profileForm = this.fb.group({
      name: [
        this.userProfile.name,
        {
          validators: [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern(/^[A-Za-z]+$/),
          ],
        },
      ],
      surname: [
        this.userProfile.surname,
        {
          validators: [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern(/^[A-Za-z]+$/),
          ],
        },
      ],
      email: [
        this.userProfile.email,
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/),
        ],
      ],
      bio: [this.userProfile.bio, { validators: [] }],
      businessOffice: [this.userProfile.businessOffice, { validators: [] }],
      companyName: [
        this.userProfile.nameOfCompany,
        {
          validators: [
            Validators.pattern(/^[0-9A-Za-zÀ-ÿ\s,._+;()*~'#@!?&-]+$/),
          ],
        },
      ],
      sizeOfCompany: [this.userProfile.sizeOfCompany, { validators: [] }],
      avatarBinding: [],
    });
  }
}
