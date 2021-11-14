import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

export class IsEmailTakenValidator {
  static createIsEmailTakenValidator(authServ: AuthService): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ emailTaken: true } | null> => {
      return authServ
        .checkEmail(control.value)
        .pipe(
          map((isEmailTaken: boolean) =>
            isEmailTaken ? { emailTaken: true } : null
          )
        );
    };
  }
}
