import { NotyService } from './noty.service';
import { Injectable } from '@angular/core';
import * as Peer from 'peerjs';
import { BehaviorSubject, Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class CallService {
  private peer!: Peer;
  private mediaCall!: Peer.MediaConnection;

  private localStreamBs: BehaviorSubject<MediaStream | any> =
    new BehaviorSubject(null);
  public localStream$ = this.localStreamBs.asObservable();
  private remoteStreamBs: BehaviorSubject<MediaStream | any> =
    new BehaviorSubject(null);
  public remoteStream$ = this.remoteStreamBs.asObservable();

  private isCallStartedBs = new Subject<boolean>();
  public isCallStarted$ = this.isCallStartedBs.asObservable();

  constructor(private readonly noty: NotyService) {}

  public initPeer(): string {
    if (!this.peer || this.peer.disconnected) {
      const peerJsOptions: Peer.PeerJSOption = {
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
        let id = uuidv4();
        this.peer = new Peer(id, peerJsOptions);
        return id;
      } catch (error) {
        console.error(error);
      }
    }

    return '';
  }

  public async establishMediaCall(remotePeerId: string) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      const connection = this.peer.connect(remotePeerId);
      connection.on('error', (err) => {
        console.error(err);
        this.noty.error('Connection closed');
      });

      this.mediaCall = this.peer.call(remotePeerId, stream);
      if (!this.mediaCall) {
        let errorMessage = 'Unable to connect to remote peer';
        this.noty.error('Connection closed');
        throw new Error(errorMessage);
      }
      this.localStreamBs.next(stream);
      this.isCallStartedBs.next(true);

      this.mediaCall.on('stream', (remoteStream) => {
        this.remoteStreamBs.next(remoteStream);
      });
      this.mediaCall.on('error', (err) => {
        this.noty.error('Connection closed');
        console.error(err);
        this.isCallStartedBs.next(false);
      });
      this.mediaCall.on('close', () => this.onCallClose());
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
    this.remoteStreamBs?.value.getTracks().forEach((track: any) => {
      track.stop();
    });
    this.localStreamBs?.value.getTracks().forEach((track: any) => {
      track.stop();
    });
    this.noty.error('Connection closed');
  }

  public closeMediaCall() {
    this.mediaCall?.close();
    if (!this.mediaCall) {
      this.onCallClose();
    }
    this.isCallStartedBs.next(false);
  }

  public destroyPeer() {
    this.mediaCall?.close();
    this.peer?.disconnect();
    this.peer?.destroy();
  }
}
