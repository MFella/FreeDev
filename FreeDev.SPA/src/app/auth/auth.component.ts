import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {


  loginForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  login(): void {
    
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      login: ['', { validators: [ Validators.required, Validators.minLength(6), Validators.maxLength(255),
        Validators.pattern(/^[a-zA-Z0-9_.-]*$/)]}],
      password: ['', { validators: [ Validators.required, Validators.minLength(10),
      Validators.pattern(/^(?=\D*\d)(?=.*?[a-zA-Z]).*[\W_].*$/)]}]
    })
  }
}
