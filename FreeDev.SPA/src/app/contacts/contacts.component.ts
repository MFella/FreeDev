import { LocalStorageService } from './../services/local-storage.service';
import { FolderType } from './../types/contacts/folderType';
import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  private static readonly LAST_SAVED_OPTION_LS_KEY =
    'last-selected-folder-option';
  folderOptions!: Array<ButtonFolderOption>;

  selectedFolder: FolderType = FolderType.INBOX;
  mailList: Array<any> = [];

  constructor(
    private readonly lsServ: LocalStorageService,
    private readonly messageService: MessagesService
  ) {
    this.setFolderOptions();
  }

  ngOnInit(): void {
    const possibleLastSelectedFolderOption = this.lsServ.get(
      ContactsComponent.LAST_SAVED_OPTION_LS_KEY
    );
    if (possibleLastSelectedFolderOption) {
      this.selectedFolder = possibleLastSelectedFolderOption;
    }

    this.observeFolderMessages();
  }

  setFolderOptions(): void {
    this.folderOptions = [
      new ButtonFolderOption('Inbox', 'pi pi-inbox', FolderType.INBOX),
      new ButtonFolderOption('Send', 'pi pi-send', FolderType.SEND),
      new ButtonFolderOption(
        'New Message',
        'pi pi-plus',
        FolderType.NEW_MESSAGE
      ),
    ];
  }

  optionChanged($event: any): void {
    this.lsServ.set(
      ContactsComponent.LAST_SAVED_OPTION_LS_KEY,
      $event?.value as string
    );
    this.observeFolderMessages();
  }

  private observeFolderMessages(): void {
    this.selectedFolder !== FolderType.NEW_MESSAGE &&
      this.messageService
        .getFolderMessageList(this.selectedFolder)
        .subscribe((response: Array<any>) => {
          this.mailList = response;
          console.log('mailResponse', response);
        });
  }
}

export class ButtonFolderOption {
  constructor(
    private readonly label: string,
    private readonly iconClass: string,
    private readonly folderType: FolderType
  ) {}
}
