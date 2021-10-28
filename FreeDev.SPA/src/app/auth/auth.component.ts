import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faGem, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  icons: Array<IconDefinition> = [faGem];
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  login(): void {
    console.log(this.loginForm);
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', { validators: [ Validators.required, Validators.minLength(6), Validators.maxLength(320),
        Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)]}],
      password: ['', { validators: [ Validators.required, Validators.minLength(10),
      Validators.pattern(/^(?=\D*\d)(?=.*?[a-zA-Z]).*[\W_].*$/)]}]
    })
  }
}
