import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {MailMessageToSend} from "../types/contacts/mailMessageToSend";

@Injectable()
export class MailService {

  constructor(
    private readonly http: HttpClient
  ) {
  }

  sendMailMessage(mailMessageToSend: MailMessageToSend): Observable<boolean> {
    return this.http.post<boolean>(this.getRestUrl() + '', mailMessageToSend);
  }

  getRestUrl(): string {
    return environment.backendUrl + 'mail/';
  }
}
