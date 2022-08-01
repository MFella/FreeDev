import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {faGem, IconDefinition} from '@fortawesome/free-solid-svg-icons';
import {UserToLoginDto} from '../dtos/users/userToLoginDto';
import {AuthService} from '../services/auth.service';
import {NotyService} from '../services/noty.service';
import {combineLatest, Observable} from "rxjs";
import {defaultIfEmpty, filter, startWith} from "rxjs/operators";

export enum LoginFormFieldKeys {
  EMAIL = 'email',
  PASSWORD = 'password'
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  icons: Array<IconDefinition> = [faGem];
  loginForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly noty: NotyService
  ) {
  }

  ngOnInit() {
    this.initForm();
    this.observeFieldsStatusChange();
  }

  login($event: Event): void {
    $event.preventDefault();
    const userToLoginDto: UserToLoginDto = {...this.loginForm.getRawValue()};
    this.authService.login(userToLoginDto).subscribe(
      (response: any) => {
        this.loginForm.reset();
        this.noty.success('You have been logged in successfully!');
        this.router.navigate(['/home']);
        this.authService.loginAction$.next();
      },
      (error: HttpErrorResponse) => {
        this.noty.error(error.error.message);
      }
    );
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      [LoginFormFieldKeys.EMAIL]: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(320),
            Validators.pattern(
              /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
            ),
          ],
        },
      ],
      [LoginFormFieldKeys.PASSWORD]: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(10),
            Validators.pattern(/^(?=\D*\d)(?=.*?[a-zA-Z]).*[\W_].*$/),
          ],
        },
      ],
    });
  }

  private observeFieldsStatusChange(): void {
    const emailField = this.loginForm?.get(LoginFormFieldKeys.EMAIL);
    const passwordField = this.loginForm?.get(LoginFormFieldKeys.PASSWORD);

    emailField && passwordField && combineLatest([
      emailField?.valueChanges.pipe(startWith('')),
      passwordField?.valueChanges.pipe(startWith(''))
    ])
      .subscribe(([emailFieldValue, passwordFieldValue]: [string | null, string | null]) => {
        if (emailFieldValue === '') {
          emailField?.markAsPristine();
        }
        if (passwordFieldValue === '') {
          passwordField?.markAsPristine();
        }
      });
  }
}
