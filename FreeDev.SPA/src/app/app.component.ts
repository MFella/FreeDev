import { Component, OnDestroy, OnInit } from '@angular/core';
import { WsService } from './services/ws.service';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { Subject, Subscription, iif } from 'rxjs';
import { IncomingCallAnswer } from './types/call/incomingCallAnswer';
import { AuthService } from './services/auth.service';
import { DecisionCallComponent } from './decision-call/decision-call.component';
import { DialogService } from 'primeng/dynamicdialog';
import { AuthAction } from './types/authAction';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DialogService],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'free-dev';

  destroy$: Subject<void> = new Subject<void>();

  callSubscription: Subscription | null = new Subscription();

  constructor(
    private readonly wsService: WsService,
    private readonly authService: AuthService,
    private readonly dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.observeLogInActionFired();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  private observeLogInActionFired(): void {
    this.authService
      .observeAuthAction()
      .pipe(takeUntil(this.destroy$))
      .subscribe((authAction: AuthAction) => {
        if (authAction === 'login') {
          this.observeIncomingCall();
        } else {
          this.callSubscription?.unsubscribe();
          this.callSubscription = null;
        }
      });
  }

  private observeIncomingCall(): void {
    this.callSubscription = this.wsService
      .observeIncomingCall()
      .pipe(
        filter(
          (incomingCallAnswer: IncomingCallAnswer) =>
            incomingCallAnswer.targetUserId ===
            this.authService.getStoredUser()?._id
        ),
        takeUntil(this.destroy$),
        takeUntil(
          this.authService
            .observeAuthAction()
            .pipe(filter((authAction: AuthAction) => authAction === 'logout'))
        )
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
