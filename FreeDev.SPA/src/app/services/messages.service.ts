import {environment} from './../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {HttpErrorResponseHandler} from '../common/handlers/httpErrorResponseHandler';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  constructor(
    private readonly http: HttpClient,
    private readonly httpErrorResponseHandler: HttpErrorResponseHandler
  ) {
  }

  getRestUrl(): string {
    return environment.backendUrl + 'message';
  }
}
