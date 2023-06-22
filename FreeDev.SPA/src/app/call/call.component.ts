import { CallService } from './../services/call.service';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CallMediaType } from '../types/call/callMediaType';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject, combineLatest } from 'rxjs';
import { WsService } from '../services/ws.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss'],
})
export class CallComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('localVideo')
  localVideo!: ElementRef<HTMLVideoElement>;

  @ViewChild('guestVideo')
  guestVideo!: ElementRef<HTMLVideoElement>;

  guestAvatarUrl: string = '';

  yourAvatarUrl: string = '';

  isConnected: boolean = false;

  private destroy$: Subject<void> = new Subject<void>();

  private guestId!: string;

  constructor(
    private readonly callServ: CallService,
    private readonly authService: AuthService,
    private readonly wsService: WsService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.guestAvatarUrl = this.config.data?.guestAvatarUrl;
    this.yourAvatarUrl = this.config.data?.yourAvatarUrl;
    this.guestId = this.callServ.initPeer(this.config.data?.guestId ?? '');
    this.observeStreams();
  }

  ngAfterViewInit(): void {
    this.callServ.establishMediaCall(this.guestId);
    this.observeCancellationOfCall();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  finishCall(): void {
    this.callServ.closeMediaCall();
    this.ref.close();
    this.callServ.destroyPeer();
    this.wsService.sendCancellationOfCall(
      this.authService.getStoredUser()?._id,
      this.guestId
    );
  }

  toggleMic(): void {
    this.callServ.toggleMedia(CallMediaType.AUDIO);
  }

  toggleCamera(): void {
    this.callServ.toggleMedia(CallMediaType.VIDEO);
  }

  observeStreams(): void {
    combineLatest([
      this.callServ.localStream$.pipe(filter((res) => !!res)),
      this.callServ.videoEnabledState$,
    ]).subscribe(([stream, isVideoAvailable]: [any, boolean]) => {
      if (this.localVideo?.nativeElement && stream && isVideoAvailable) {
        this.localVideo.nativeElement.srcObject = stream;
      }
    });
    this.callServ.remoteStream$
      .pipe(filter((res) => !!res))
      .subscribe((stream: any) => {
        if (this.guestVideo?.nativeElement) {
          this.guestVideo.nativeElement.srcObject = stream;
        }
      });
  }

  private observeJoinAction(): void {}

  private observeDeclineAction(): void {}

  observeCancellationOfCall(): void {
    this.wsService
      .observeCancellationOfCall()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        console.log('should be closed!');
        this.callServ.closeMediaCall();
        this.ref.close();
        this.callServ.destroyPeer();
      });
  }
}
