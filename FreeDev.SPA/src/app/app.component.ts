import { Component, OnDestroy, OnInit } from '@angular/core';
import { WsService } from './services/ws.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IncomingCallAnswer } from './types/call/incomingCallAnswer';
import { AuthService } from './services/auth.service';
import { DecisionCallComponent } from './decision-call/decision-call.component';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DialogService],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'free-dev';

  destroy$: Subject<void> = new Subject<void>();

  constructor(
    private readonly wsService: WsService,
    private readonly authService: AuthService,
    private readonly dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.observeIncomingCall();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  // todo: what is going on, when user is not logged in
  private observeIncomingCall(): void {
    this.wsService
      .observeIncomingCall()
      .pipe(
        filter(
          (incomingCallAnswer: IncomingCallAnswer) =>
            incomingCallAnswer.targetUserId ===
            this.authService.getStoredUser()?._id
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((incomingCallAnswer: IncomingCallAnswer) => {
        console.log('responsedasdas', incomingCallAnswer);
        this.dialogService.open(DecisionCallComponent, {
          data: {
            guestAvatarUrl: incomingCallAnswer?.imageUrl,
            guestId: incomingCallAnswer?.sourceUserId,
            guestName: `${incomingCallAnswer.name} ${incomingCallAnswer.surname}`,
          },
          showHeader: false,
          width: '90%',
        });
      });
  }
}
