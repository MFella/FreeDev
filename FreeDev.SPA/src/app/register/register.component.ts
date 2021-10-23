import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  }

  
  isContractJob(): boolean {
    return this.registerForm.get('contractName')?.value === 'contract-job';
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      name: ['', { validators: [Validators.required, Validators.pattern(/^[A-Za-z]+$/)] }],
      surname: ['', { validators: [Validators.required, Validators.pattern(/^[A-Za-z]+$/)] }],
      email: ['', { validators: [Validators.required, Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)]} ],
      password: ['', { validators: [Validators.required, Validators.pattern(/^^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/)]}],
      repeatPassword: ['', { validators: [Validators.required, Validators.pattern(/^^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/)]}],
      contractName: ['contract-job', { validators: [Validators.required]} ],
      bio: ['', { validators: []}],
      technologies: ['', { validators: [Validators.required]}],
      companyName: ['', { validators: [Validators.required, Validators.pattern(/^[0-9A-Za-zÀ-ÿ\s,._+;()*~'#@!?&-]+$/)]}],
      originCountry: ['', { validators: [Validators.required]}],
      originCity: ['', { validators: [Validators.required]}],
      hobbies: ['', { validators: []}],
      sizeOfCompany: ['', { validators: [Validators.required]}]
    })
  }
}
