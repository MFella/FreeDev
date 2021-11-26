import { Roles } from '../types/roles.enum';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import {
  faEdit,
  faSave,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Data } from '@angular/router';
import { UsersService } from '../services/users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotyService } from '../services/noty.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SignedFileUrlDto } from '../dtos/signedFileUrlDto';
import { FileUpload } from 'primeng/fileupload';
import { Dropdown } from 'primeng/dropdown';
import { UserToProfileDto } from '../dtos/users/userToProfileDto';
import { UserToUpdateDto } from '../dtos/users/userToUpdateDto';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileUploader') fileUploader!: FileUpload;

  @ViewChild('dropdownSizeCompany') dropdownSizeCompany!: Dropdown;

  profileForm!: FormGroup;

  isSpinnerVisible: boolean = false;

  avatarToUpload: File | null = null;

  isReadonly: boolean = true;

  isLoading: boolean = false;

  userProfile!: UserToProfileDto;

  editMode: boolean = false;

  temporaryEditData!: any;

  icons: Array<IconDefinition> = [faEdit, faSave, faTimesCircle];

  readonly sizesOfCompany: Array<object> = [
    { name: 'Small' },
    { name: 'Medium' },
    { name: 'Large' },
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly userServ: UsersService,
    private readonly noty: NotyService,
    private readonly spinner: NgxSpinnerService,
    private readonly changeDetectorRef: ChangeDetectorRef
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

      this.profileForm.get('avatar')?.disable();
    });
  }

  async updateUserInfo(): Promise<void> {
    const arrayBuffer = await this.avatarToUpload?.arrayBuffer();
    this.spinner.show('updateResponseWaiting', {
      type: 'ball-clip-rotate',
      size: 'small',
      color: '#000000',
    });
    this.isLoading = true;

    const { avatar, sizeOfCompany, ...pipedProfileFormRawValue } =
      this.profileForm.getRawValue();

    const userToUpdateDto: UserToUpdateDto = {
      avatarName: this.avatarToUpload?.name,
      avatarToUpload: Buffer.from(arrayBuffer ?? ''),
      sizeOfComapany: sizeOfCompany?.name,
      ...pipedProfileFormRawValue,
    };

    if (this.profileForm.get('avatar')?.value) {
      this.spinner.show('updateAvatarResponseWaiting', {
        type: 'ball-clip-rotate',
        size: 'small',
        color: '#000000',
      });
    }

    this.userServ
      .updateUserInfo(userToUpdateDto, this.route.snapshot.queryParams?.id)
      .subscribe(
        (response: SignedFileUrlDto) => {
          this.userProfile.avatarUrl = response.signedFileUrl;
          if (response) {
            this.isReadonly = !this.isReadonly;
          } else {
            this.noty.error('Couldnt save your data');
          }

          this.profileForm.get('avatar')?.setValue('');
          this.changeDetectorRef.detectChanges();
          this.noty.info('Profile has been updated');
          this.fileUploader.clear();
        },
        (error: HttpErrorResponse) => {
          this.noty.error(error.error.message);
          this.spinner.hide('updateResponseWaiting');
          this.spinner.hide('updateAvatarResponseWaiting');
          this.isLoading = false;
        },
        () => {
          this.spinner.hide('updateResponseWaiting');
          this.spinner.hide('updateAvatarResponseWaiting');
          this.isLoading = false;
        }
      );
  }

  setAvatarToUpload($event: any): void {
    const avatarToUpload: FileList | null = $event?.files;
    if (!avatarToUpload) {
      this.avatarToUpload = avatarToUpload;
    } else {
      this.avatarToUpload = avatarToUpload[0];
    }
  }

  removeFile(file: File, uploader: FileUpload): void {
    uploader.remove(null as any, uploader.files.indexOf(file));
  }

  cancelEditMode(): void {
    this.profileForm.setValue(this.temporaryEditData);
    this.avatarToUpload = null;
    this.isReadonly = !this.isReadonly;
    this.profileForm.get('avatar')?.disable();
    this.fileUploader.clear();
  }

  setEditMode(): void {
    this.temporaryEditData = this.profileForm.getRawValue();
    this.isSpinnerVisible = true;
    this.isReadonly = !this.isReadonly;
    this.profileForm.get('avatar')?.enable();
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
      avatar: [],
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
      sizeOfCompany: [
        { name: this.capitalizeString(this.userProfile.sizeOfCompany) },
        { validators: [] },
      ],
      avatar: [],
    });
  }

  private capitalizeString(stringToCapitalize: string | undefined): string {
    if (!stringToCapitalize) {
      return '';
    }
    return (
      stringToCapitalize.charAt(0).toUpperCase() + stringToCapitalize.slice(1)
    );
  }
}
