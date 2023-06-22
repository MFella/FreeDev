import { CallMediaType } from './../types/call/callMediaType';
import { NotyService } from './noty.service';
import { Injectable } from '@angular/core';
import Peer, { DataConnection, MediaConnection, PeerJSOption } from 'peerjs';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { WsService } from './ws.service';

@Injectable({
  providedIn: 'root',
})
export class CallService {
  private peer!: Peer;
  private mediaCall!: MediaConnection;

  private localStreamBs: BehaviorSubject<MediaStream | any> =
    new BehaviorSubject(null);

  public localStream$ = this.localStreamBs.asObservable();

  private remoteStreamBs: BehaviorSubject<MediaStream | any> =
    new BehaviorSubject(null);

  public remoteStream$ = this.remoteStreamBs.asObservable();

  private isCallStartedBs = new Subject<boolean>();
  public isCallStarted$ = this.isCallStartedBs.asObservable();

  private connection!: DataConnection;

  // private stream!: MediaStream;

  public audioEnabledState$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  public videoEnabledState$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  private audioEnabled: boolean = true;

  private videoEnabled: boolean = true;

  private isCallEnded$: Subject<void> = new Subject<void>();

  private stream: any;

  constructor(
    private readonly noty: NotyService,
    private readonly wsService: WsService
  ) {}

  public initPeer(peerId: string): string {
    if (!this.peer || this.peer.disconnected) {
      const peerJsOptions: PeerJSOption = {
        debug: 3,
        config: {
          iceServers: [
            {
              urls: [
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302',
              ],
            },
          ],
        },
      };
      try {
        this.peer = new Peer(peerId, peerJsOptions);
        return peerId;
      } catch (error) {
        console.error(error);
      }
    }

    return '';
  }

  public async establishMediaCall(remotePeerId: string) {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: this.videoEnabled,
        audio: this.audioEnabled,
      });

      if (!this.connection) {
        this.connection = this.peer.connect(remotePeerId);
      }

      this.connection.on('error', (err: any) => {
        console.error(err);
        this.noty.error('Connection closed');
      });

      this.connection.on('close', () => {
        this.onCallClose();
      });

      this.mediaCall = this.peer.call(remotePeerId, this.stream);
      if (!this.mediaCall) {
        let errorMessage = 'Unable to connect to remote peer';
        this.noty.error('Connection closed');
        return;
        // throw new Error(errorMessage);
      }
      this.localStreamBs.next(this.stream);
      this.isCallStartedBs.next(true);

      this.mediaCall.on('stream', (remoteStream) => {
        this.remoteStreamBs.next(remoteStream);
      });
      this.mediaCall.on('error', (err) => {
        this.noty.error('Connection closed');
        console.error(err);
        this.isCallStartedBs.next(false);
      });
      this.mediaCall.on('close', () => {
        this.onCallClose();
      });
    } catch (ex) {
      console.error(ex);
      this.noty.error('Connection closed');
      this.isCallStartedBs.next(false);
    }
  }

  public async enableCallAnswer() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      this.localStreamBs.next(stream);
      this.peer.on('call', async (call) => {
        this.mediaCall = call;
        this.isCallStartedBs.next(true);

        this.mediaCall.answer(stream);
        this.mediaCall.on('stream', (remoteStream) => {
          this.remoteStreamBs.next(remoteStream);
        });
        this.mediaCall.on('error', (err) => {
          this.noty.error('Connection closed');
          this.isCallStartedBs.next(false);
          console.error(err);
        });
        this.mediaCall.on('close', () => this.onCallClose());
      });
    } catch (ex) {
      console.error(ex);
      this.noty.error('Connection closed');
      this.isCallStartedBs.next(false);
    }
  }

  private onCallClose() {
    if (this.remoteStreamBs?.value) {
      this.remoteStreamBs?.value.getTracks().forEach((track: any) => {
        track.stop();
      });
    }

    if (this.localStreamBs?.value) {
      this.localStreamBs?.value.getTracks().forEach((track: any) => {
        track.stop();
      });
    }

    this.noty.success('Connection closed');
    this.isCallEnded$.next();
  }

  public closeMediaCall() {
    this.mediaCall?.close();
    // if (!this.mediaCall) {
    this.onCallClose();
    // }
    this.connection?.close();
    this.isCallStartedBs.next(false);
  }

  public destroyPeer() {
    this.mediaCall?.close();
    this.peer?.disconnect();
    this.peer?.destroy();
  }

  public async toggleMedia(mediaToToggle: CallMediaType): Promise<void> {
    switch (mediaToToggle) {
      case CallMediaType.VIDEO:
        this.videoEnabled = !this.videoEnabled;
        this.videoEnabledState$.next(this.videoEnabled);
        this.stream.getVideoTracks()[0].enabled =
          !this.stream.getVideoTracks()[0].enabled;
        return;
      case CallMediaType.AUDIO:
        this.audioEnabled = !this.audioEnabled;
        this.audioEnabledState$.next(this.audioEnabled);
        this.stream.getAudioTracks()[0].enabled =
          !this.stream.getAudioTracks()[0].enabled;
        return;
      default:
        return;
    }
  }

  public getIsCallEnded(): Observable<void> {
    return this.isCallEnded$.asObservable();
  }
}
