import {
  Component,
  Input,
} from '@angular/core';
import {FolderType} from 'src/app/types/contacts/folderType';
import {take} from "rxjs/operators";
import {MailService} from "../../services/mail.service";

@Component({
  selector: 'mail-list',
  templateUrl: './mail-list.component.html',
  styleUrls: ['./mail-list.component.scss'],
})
export class MailListComponent {

  @Input()
  mailList!: Array<any>;

  @Input()
  folder!: FolderType;

  constructor(
    private readonly mailService: MailService
  ) {
  }

  observeMessageContent(messageId: string): void {
    this.mailService.getMessageContent(messageId)
      .pipe(take(1))
      .subscribe((messageContent: string) => {
        console.log('msgContent', messageContent);
      })
  }

  trackByFn(index: number, item: any): number {
    return index;
  }
}
