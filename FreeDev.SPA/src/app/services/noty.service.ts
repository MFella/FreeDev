import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotyService {

  constructor(private toastr: ToastrService) {
  }

  success(msg: string): void {
    this.toastr.success(msg);
  }

  error(msg: string): void {
    this.toastr.error(msg);
  }

}
