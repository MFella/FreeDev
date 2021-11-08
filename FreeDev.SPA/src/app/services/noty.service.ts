import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

declare let alertify: any;

@Injectable({
  providedIn: 'root',
})
export class NotyService {
  constructor(
    private readonly toastr: ToastrService,
    private readonly router: Router
  ) {}

  success(msg: string): void {
    this.toastr.success(msg);
  }

  error(msg: string): void {
    this.toastr.error(msg);
  }

  confirm(message: string): void {
    alertify
      .confirm(message, () => this.router.navigate(['']))
      .setHeader(`<strong>Confirm</strong`);
  }
}
