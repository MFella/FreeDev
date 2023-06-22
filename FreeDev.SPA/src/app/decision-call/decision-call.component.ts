import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CallService } from '../services/call.service';
import { WsService } from '../services/ws.service';
import { AuthService } from '../services/auth.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-decision-call',
  templateUrl: './decision-call.component.html',
  styleUrls: ['./decision-call.component.scss'],
})
export class DecisionCallComponent implements OnInit, OnDestroy {
  constructor(
    private readonly wsService: WsService,
    private readonly authService: AuthService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  guestAvatarUrl: string = '';
  guestName: string = '';
  guestId: string = '';
  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit() {
    this.observeCancellationOfCall();
    this.guestAvatarUrl = this.config.data?.guestAvatarUrl;
    this.guestName = this.config.data?.guestName;
    this.guestId = this.config.data?.guestId;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  rejectCall(): void {
    this.wsService.sendCancellationOfCall(
      this.authService.getStoredUser()._id,
      this.guestId
    );
    this.ref.close();
  }

  acceptCall(): void {}

  observeCancellationOfCall(): void {
    this.wsService
      .observeCancellationOfCall()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.ref.close());
  }
}
