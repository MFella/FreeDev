import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
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
import {
  CountryFilePayload,
  CountrySelectItem,
  UsersService,
} from '../services/users.service';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  private static readonly NOT_AVAILABLE_COUNTRY_OPTION: CountrySelectItem = {
    code: 'N/A',
    name: 'Not available',
  };
  registerForm!: FormGroup;
  isEmailAlreadyTaken: boolean = false;
  sizesOfCompany: Array<{ name: string }> = [
    { name: 'Small' },
    { name: 'Medium' },
    { name: 'Large' },
  ];

  filteredCountries: Array<CountrySelectItem> = [];

  countryList: Array<CountrySelectItem> = [];

  constructor(
    private router: Router,
    private authServ: AuthService,
    private noty: NotyService,
    private readonly usersService: UsersService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initForm();
    this.observeCountryList();
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
    this.registerForm = new FormGroup(
      {
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[A-Za-z]+$/),
        ]),
        // [
        //   '',
        //   {
        // validators: [
        // Validators.required,
        // Validators.minLength(2),
        // Validators.pattern(/^[A-Za-z]+$/),
        // ],
        //   },
        // ],
        surname: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[A-Za-z]+$/),
        ]),
        email: new FormControl(
          '',
          [
            Validators.required,
            Validators.pattern(
              /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
            ),
          ],
          [IsEmailTakenValidator.createIsEmailTakenValidator(this.authServ)]
        ),
        password: new FormControl('', [
          Validators.required,
          Validators.pattern(
            /^^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
          ),
        ]),

        repeatPassword: new FormControl('', [
          Validators.required,
          Validators.pattern(
            /^^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
          ),
        ]),

        contractName: new FormControl('contract-job', [Validators.required]),
        bio: new FormControl('', []),
        technologies: new FormControl(''),
        companyName: new FormControl('', [
          Validators.pattern(/^[0-9A-Za-zÀ-ÿ\s,._+;()*~'#@!?&-]+$/),
        ]),
        businessOffice: new FormControl(''),
        originCountry: new FormControl('', [
          // Validators.minLength(2),
          // Validators.pattern(/^[A-Za-z]+$/),
          this.isCountryWithinList.bind(this),
        ]),
        originCity: new FormControl('', [
          Validators.minLength(2),
          Validators.pattern(/^[A-Za-z]+$/),
        ]),
        hobbies: new FormControl(''),
        sizeOfCompany: new FormControl('small'),
      },
      [this.passwordMatch.bind(this)]
    );
  }

  passwordMatch(abstractControl: AbstractControl): Object | null {
    return abstractControl.get('password')!.value ===
      abstractControl.get('repeatPassword')!.value
      ? null
      : {
          mismatchPassword: true,
        };
  }

  isCountryWithinList(
    abstractControl: AbstractControl
  ): ValidationErrors | null {
    return this.countryList.find(
      (country: CountrySelectItem) =>
        (country.name === abstractControl?.value?.name &&
          country.code === abstractControl?.value?.code) ||
        abstractControl?.value === country.name
    )
      ? null
      : { wrongCountry: true };
  }

  isFormValid(): boolean {
    return (
      this.registerForm.touched &&
      Object.values(this.registerForm.controls)
        .map((control) => control.errors)
        .filter((error: any) => !error?.required && error !== null).length === 0
    );
  }

  applyFilterForCountries($event: AutoCompleteCompleteEvent): void {
    const filteredCountries = this.countryList.filter(
      (country: CountrySelectItem) =>
        country.name.toLowerCase().indexOf($event.query.toLowerCase()) === 0 ||
        country.code.toLowerCase().indexOf($event.query.toLowerCase()) === 0
    );

    Object.assign(this.filteredCountries, filteredCountries);

    this.filteredCountries = [...filteredCountries];
  }

  countrySelected(): void {
    if (
      this.registerForm.get('originCountry')?.value?.code ===
      RegisterComponent.NOT_AVAILABLE_COUNTRY_OPTION.code
    ) {
      this.registerForm.get('originCountry')?.reset();
    }
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

  private observeCountryList(): void {
    this.usersService
      .selectCountryList()
      .then((countryFilePayload: CountryFilePayload) => {
        this.countryList = countryFilePayload.data;
      });
  }
}
