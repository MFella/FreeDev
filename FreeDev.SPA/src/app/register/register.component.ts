import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeToRegisterDto } from '../types/employeeToRegisterDto';
import { EmployerToRegisterDto } from '../types/employerToRegisterDto';
import { ContractConverter } from '../utils/contractConverter';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  register(): void {
    console.log(this.registerForm);
    const contractToRegisterDto = this.convertToRegisterDto(this.registerForm.get('contractName')?.value);
    console.log('contract', contractToRegisterDto);
  }

  
  isContractJob(): boolean {
    return this.registerForm.get('contractName')?.value === 'contract-job';
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      name: ['', { validators: [Validators.required, Validators.minLength(2), Validators.pattern(/^[A-Za-z]+$/)] }],
      surname: ['', { validators: [Validators.required, Validators.minLength(2), Validators.pattern(/^[A-Za-z]+$/)] }],
      email: ['', { validators: [Validators.required, Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)]} ],
      password: ['', { validators: [Validators.required, Validators.pattern(/^^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/)]}],
      repeatPassword: ['', { validators: [Validators.required, Validators.pattern(/^^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/)]}],
      contractName: ['contract-job', { validators: [Validators.required]} ],
      bio: ['', { validators: []}],
      technologies: ['', { validators: []}],
      companyName: ['', { validators: [Validators.pattern(/^[0-9A-Za-zÀ-ÿ\s,._+;()*~'#@!?&-]+$/)]}],
      bussinessOffice: ['', { validators: []}],
      originCountry: ['', { validators: [Validators.minLength(2), Validators.pattern(/^[A-Za-z]+$/)]}],
      originCity: ['', { validators: [Validators.minLength(2), Validators.pattern(/^[A-Za-z]+$/)]}],
      hobbies: ['', { validators: []}],
      sizeOfCompany: ['small', { validators: []}]
    }, { validators: [this.passwordMatch] })
  }

  passwordMatch(formGroup: FormGroup): Object | null {
    return formGroup.get('password')!.value === formGroup.get('repeatPassword')!.value ? null : 
    {
      'mismatchPassword': true
    };
  }

  private convertToRegisterDto(contractType: string): EmployerToRegisterDto | EmployeeToRegisterDto | null {
  
    switch(contractType) {
      case 'contract-job':
        const employeeContractToRegisterDto: EmployeeToRegisterDto = ContractConverter.convertEmployeeToRegisterDto(this.registerForm.getRawValue());
        return employeeContractToRegisterDto;
      case 'contract-empl':
        const employerContractToRegisterDto: EmployerToRegisterDto = ContractConverter.convertEmployerToRegisterDto(this.registerForm.getRawValue());
        return employerContractToRegisterDto;
      default:
        return null;
    }
  }
}
