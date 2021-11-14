import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NotyService } from '../services/noty.service';
import { EmployeeToRegisterDto } from '../types/employeeToRegisterDto';
import { EmployerToRegisterDto } from '../types/employerToRegisterDto';
import { ContractConverter } from '../utils/contractConverter';
import { IsEmailTakenValidator } from './validators/isEmailTakenValidator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isEmailAlreadyTaken: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authServ: AuthService,
    private noty: NotyService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  register(): void {
    const contractType: string = this.registerForm.get('contractName')?.value;
    const contractToRegisterDto = this.convertToRegisterDto(contractType);
    this.authServ.createUser(contractToRegisterDto, contractType).subscribe(
      (res: any) => {
        this.noty.success('You have been registered!');
        this.registerForm.reset();
        this.router.navigate(['home']);
      },
      (error: HttpErrorResponse) => {
        this.noty.error(error.error?.message);
      }
    );
  }

  isContractJob(): boolean {
    return this.registerForm.get('contractName')?.value === 'contract-job';
  }

  private initForm(): void {
    this.registerForm = this.fb.group(
      {
        name: [
          '',
          {
            validators: [
              Validators.required,
              Validators.minLength(2),
              Validators.pattern(/^[A-Za-z]+$/),
            ],
          },
        ],
        surname: [
          '',
          {
            validators: [
              Validators.required,
              Validators.minLength(2),
              Validators.pattern(/^[A-Za-z]+$/),
            ],
          },
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
            ),
          ],
          [IsEmailTakenValidator.createIsEmailTakenValidator(this.authServ)],
        ],
        password: [
          '',
          {
            validators: [
              Validators.required,
              Validators.pattern(
                /^^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
              ),
            ],
          },
        ],
        repeatPassword: [
          '',
          {
            validators: [
              Validators.required,
              Validators.pattern(
                /^^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
              ),
            ],
          },
        ],
        contractName: ['contract-job', { validators: [Validators.required] }],
        bio: ['', { validators: [] }],
        technologies: ['', { validators: [] }],
        companyName: [
          '',
          {
            validators: [
              Validators.pattern(/^[0-9A-Za-zÀ-ÿ\s,._+;()*~'#@!?&-]+$/),
            ],
          },
        ],
        businessOffice: ['', { validators: [] }],
        originCountry: [
          '',
          {
            validators: [
              Validators.minLength(2),
              Validators.pattern(/^[A-Za-z]+$/),
            ],
          },
        ],
        originCity: [
          '',
          {
            validators: [
              Validators.minLength(2),
              Validators.pattern(/^[A-Za-z]+$/),
            ],
          },
        ],
        hobbies: ['', { validators: [] }],
        sizeOfCompany: ['small', { validators: [] }],
      },
      {
        validators: [this.passwordMatch],
      }
    );
  }

  passwordMatch(formGroup: FormGroup): Object | null {
    return formGroup.get('password')!.value ===
      formGroup.get('repeatPassword')!.value
      ? null
      : {
          mismatchPassword: true,
        };
  }

  isFormValid(): boolean {
    return (
      this.registerForm.touched &&
      Object.values(this.registerForm.controls)
        .map((control) => control.errors)
        .filter((error: any) => !error?.required && error !== null).length === 0
    );
  }

  private convertToRegisterDto(
    contractType: string
  ): EmployerToRegisterDto | EmployeeToRegisterDto | null {
    switch (contractType) {
      case 'contract-job':
        const employeeContractToRegisterDto: EmployeeToRegisterDto =
          ContractConverter.convertEmployeeToRegisterDto(
            this.registerForm.getRawValue()
          );
        return employeeContractToRegisterDto;
      case 'contract-empl':
        const employerContractToRegisterDto: EmployerToRegisterDto =
          ContractConverter.convertEmployerToRegisterDto(
            this.registerForm.getRawValue()
          );
        return employerContractToRegisterDto;
      default:
        return null;
    }
  }
}
