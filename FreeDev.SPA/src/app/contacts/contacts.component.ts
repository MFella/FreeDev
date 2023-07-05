import { LocalStorageService } from './../services/local-storage.service';
import { FolderType } from '../types/mail/folderType';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FolderOption } from '../types/mail/folderOption';
import { NgModel } from '@angular/forms';
import { ListBoxOptionChangedEvent } from '../types/events/listBoxOptionChangedEvent';
import { MailService } from '../services/mail.service';
import { take } from 'rxjs/operators';
import { FolderMessageDto } from '../dtos/notes/folderMessageDto';
import { ActivatedRoute } from '@angular/router';
import { PrimalComponent } from '../primal/primal.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent
  extends PrimalComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('folderOptionsRef', { read: NgModel })
  listBoxFolderOptionsRef!: NgModel;

  private static readonly LAST_SAVED_OPTION_LS_KEY =
    'last-selected-folder-option';
  mailList: Array<FolderMessageDto> = [];
  folders: Array<FolderOption> = [];

  selectedFolder: FolderOption = new FolderOption(FolderType.INBOX);

  constructor(
    private readonly lsServ: LocalStorageService,
    private readonly mailService: MailService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.observeResolvedFolderStructure();
    this.initFolderOptions();
  }

  ngAfterViewInit(): void {
    this.setLastSelectedListBoxFolderOption();
    this.observeFolderMessages();
  }

  setLastSelectedListBoxFolderOption(): void {
    const possibleLastSelectedFolderOption: FolderType = this.lsServ.get(
      ContactsComponent.LAST_SAVED_OPTION_LS_KEY
    );
    if (possibleLastSelectedFolderOption) {
      this.selectedFolder = new FolderOption(possibleLastSelectedFolderOption);
      this.changeDetectorRef.detectChanges();
      this.listBoxFolderOptionsRef.control.setValue(this.selectedFolder);
    }
  }

  optionChanged($event: ListBoxOptionChangedEvent<FolderOption>): void {
    this.lsServ.set(
      ContactsComponent.LAST_SAVED_OPTION_LS_KEY,
      $event.value.type
    );
    this.observeFolderMessages();
  }

  private observeResolvedFolderStructure(): void {
    this.activatedRoute.data
      .pipe(this.takeUntilDestroyed())
      .subscribe((folderType) => {
        console.log(folderType);
      });
  }

  private observeFolderMessages(): void {
    !this.selectedFolder.isEqual(FolderType.NEW_MESSAGE) &&
      this.mailService
        .getFolderMessageList(this.selectedFolder.type)
        .pipe(take(1))
        .subscribe((folderMessages: Array<FolderMessageDto>) => {
          this.mailList = folderMessages;
          this.changeDetectorRef.detectChanges();
        });
  }

  private initFolderOptions(): void {
    this.folders = Object.values(FolderType).map(
      (folderType) => new FolderOption(folderType)
    );
  }

  shouldDisplayNewMailForm(): boolean {
    return this.selectedFolder.isEqual(FolderType.NEW_MESSAGE);
  }
}
