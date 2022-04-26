import { Observable, throwError } from 'rxjs';
import { NotyService } from './../../services/noty.service';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class HttpErrorResponseHandler {
  constructor(private readonly notyServ: NotyService) {}

  handleErrorResponse(error: HttpErrorResponse): Observable<never> {
    const errorMessage = this.getErrorMessage(error);
    this.notyServ.error(errorMessage);
    return throwError(error);
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    return 'Error occured during saving data: ' + error.error?.message;
  }
}
