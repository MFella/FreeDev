import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { FolderType } from 'src/app/types/mail/folderType';
import { take } from 'rxjs/operators';
import { MailService } from '../../services/mail.service';
import { FolderMessageDto } from '../../dtos/notes/folderMessageDto';
import { MailMessageContentDto } from '../../types/mail/mailMessageContentDto';

@Component({
  selector: 'mail-list',
  templateUrl: './mail-list.component.html',
  styleUrls: ['./mail-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailListComponent {
  @Input()
  mailList!: Array<FolderMessageDto>;

  @Input()
  folderType: FolderType | undefined;

  messagesContentMap: Map<string, MailMessageContentDto> = new Map<
    string,
    MailMessageContentDto
  >();

  constructor(
    private readonly mailService: MailService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  observeMessageContent(messageId: string | undefined): void {
    if (this.messagesContentMap.has(messageId ?? '')) {
      return;
    }

    this.mailService
      .getMessageContent(messageId ?? '')
      .pipe(take(1))
      .subscribe((messageContent: MailMessageContentDto) => {
        this.messagesContentMap.set(messageContent._id, messageContent);

        if (this.folderType === FolderType.INBOX) {
          this.tryChangeMessageReadStatus(messageContent._id);
        }

        this.changeDetectorRef.detectChanges();
      });
  }

  getMessageContentDto(messageId: string): MailMessageContentDto | null {
    return this.messagesContentMap.get(messageId) ?? null;
  }

  shouldShowNewTag(mail: FolderMessageDto): boolean {
    return this.folderType === FolderType.INBOX && !mail.isRead;
  }

  private tryChangeMessageReadStatus(messageId: string): void {
    if (
      this.mailList.find(
        (message: FolderMessageDto) => message._id === messageId
      )?.isRead
    ) {
      return;
    }

    this.mailService
      .changeMessageReadStatus(messageId)
      .pipe(take(1))
      .subscribe((isSaved: boolean) => {
        if (isSaved) {
          for (let i = 0; i < this.mailList.length; i++) {
            if (this.mailList[i]._id === messageId) {
              this.mailList[i].isRead = true;
              return;
            }
          }
        }
      });
  }
}
