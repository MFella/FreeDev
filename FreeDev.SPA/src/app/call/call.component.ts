import { CallService } from './../services/call.service';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss'],
})
export class CallComponent implements OnInit, OnDestroy {
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
    this.peerId = this.callServ.initPeer();
    this.observeStreams();
  }

  ngOnDestroy(): void {
    this.finishCall();
  }

  finishCall(): void {
    this.ref.close();
  }

  toggleMic(): void {}

  toggleCamera(): void {}

  observeStreams(): void {
    this.callServ.localStream$.subscribe((stream: any) => {
      this.localVideo.nativeElement.srcObject = stream;
    });
    this.callServ.remoteStream$.subscribe((stream: any) => {
      this.guestVideo.nativeElement.srcObject = stream;
    });
  }

  private observeJoinAction(): void {}

  private observeDeclineAction(): void {}
}
