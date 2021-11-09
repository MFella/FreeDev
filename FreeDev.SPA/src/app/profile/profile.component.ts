import { Roles } from '../types/roles.enum';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import {
  faEdit,
  faFileUpload,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Data } from '@angular/router';
import { UserToProfileDto } from '../dtos/userToProfileDto';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;

  isReadonly: boolean = true;

  userProfile!: UserToProfileDto;

  editMode: boolean = false;

  icons: Array<IconDefinition> = [faEdit, faFileUpload, faTrash];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder
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

  private initFormForDeveloper(): void {
    this.profileForm = this.fb.group({
      name: [this.userProfile.name],
      surname: [this.userProfile.surname],
      email: [this.userProfile.email],
      bio: [this.userProfile.bio],
      city: [this.userProfile.city],
      country: [this.userProfile.country],
      technologies: [this.userProfile.technologies],
      hobbies: [this.userProfile.hobbies],
    });
  }

  private initFormForHunter(): void {
    this.profileForm = this.fb.group({
      name: [this.userProfile.name],
      surname: [this.userProfile.surname],
      email: [this.userProfile.email],
      bio: [this.userProfile.bio],
      businessOffice: [this.userProfile.businessOffice],
      companyName: [this.userProfile.nameOfCompany],
      sizeOfCompany: [this.userProfile.sizeOfCompany],
    });
  }
}
