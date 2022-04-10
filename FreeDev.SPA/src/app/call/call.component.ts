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
import { filter } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

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

  private peerId!: string;

  constructor(
    private readonly callServ: CallService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    console.log(this.config);
    this.guestAvatarUrl = this.config.data?.guestAvatarUrl;
    this.yourAvatarUrl = this.config.data?.yourAvatarUrl;
    this.peerId = this.callServ.initPeer(this.config.data?.peerId ?? '');
    this.observeStreams();
  }

  ngAfterViewInit(): void {
    this.callServ.establishMediaCall(this.peerId);
  }

  ngOnDestroy(): void {}

  finishCall(): void {
    this.callServ.closeMediaCall();
    this.ref.close();
    this.callServ.destroyPeer();
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
}
