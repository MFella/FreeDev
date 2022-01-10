import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faGem, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { UserToLoginDto } from '../dtos/users/userToLoginDto';
import { AuthService } from '../services/auth.service';
import { NotyService } from '../services/noty.service';

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
  ) {}

  ngOnInit() {
    this.initForm();
  }

  login($event: Event): void {
    console.log(this.loginForm);
    $event.preventDefault();
    const userToLoginDto: UserToLoginDto = { ...this.loginForm.getRawValue() };
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
      email: [
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
      password: [
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
}
