import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CallService } from '../services/call.service';

@Component({
  selector: 'app-decision-call',
  templateUrl: './decision-call.component.html',
  styleUrls: ['./decision-call.component.scss'],
})
export class DecisionCallComponent implements OnInit {
  constructor(
    private readonly callServ: CallService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  guestAvatarUrl: string = '';

  guestName: string = '';

  ngOnInit() {
    this.guestAvatarUrl = this.config.data?.guestAvatarUrl;
    this.guestName = this.config.data?.guestName;
  }

  rejectCall(): void {
    this.ref.close();
  }
}
