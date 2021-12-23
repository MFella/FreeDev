import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CallService {
  constructor() {}

  makeVoiceCall(): void {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream: MediaStream) => {});
  }
}
