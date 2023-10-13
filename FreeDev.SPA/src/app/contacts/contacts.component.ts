import { LocalStorageService } from './../services/local-storage.service';
import { FolderType } from '../types/mail/folderType';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
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
import { ActivatedRoute, Data } from '@angular/router';
import { PrimalComponent } from '../primal/primal.component';
import { FolderTypes } from '../types/mail/foldersStructure';
import { Pagination } from '../types/pagination';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsComponent
  extends PrimalComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('folderOptionsRef', { read: NgModel })
  listBoxFolderOptionsRef!: NgModel;

  private static readonly MAIL_LIST_ITEMS_PER_PAGE: number = 10;

  private static readonly LAST_SAVED_OPTION_LS_KEY =
    'last-selected-folder-option';

  pagination: Pagination | undefined = {
    currentPage: 1,
    itemsPerPage: ContactsComponent.MAIL_LIST_ITEMS_PER_PAGE,
  };

  mailList: Array<FolderMessageDto> = [];
  folders: Array<FolderOption> = [];

  selectedFolder: FolderOption | undefined;

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
  }

  ngAfterViewInit(): void {
    this.retrieveSelectedFolderOptionFromLs();
    this.observeFolderMessages();
  }

  retrieveSelectedFolderOptionFromLs(): void {
    const possibleLastSelectedFolderOption: FolderType | undefined =
      this.lsServ.getMailSelectedFolder(
        ContactsComponent.LAST_SAVED_OPTION_LS_KEY
      );

    if (possibleLastSelectedFolderOption) {
      this.selectedFolder = new FolderOption(possibleLastSelectedFolderOption);

      const possiblePagination: Pagination | undefined =
        this.lsServ.getMailFolderPagination(possibleLastSelectedFolderOption);

      if (possiblePagination) {
        this.pagination = possiblePagination;
      }

      this.listBoxFolderOptionsRef.control.setValue(this.selectedFolder, {
        emitModelToViewChange: false,
      });
      this.changeDetectorRef.detectChanges();
    }
  }

  optionChanged($event: ListBoxOptionChangedEvent<FolderOption>): void {
    this.lsServ.setMailSelectedFolder(
      ContactsComponent.LAST_SAVED_OPTION_LS_KEY,
      $event.value.type
    );
    this.observeFolderMessages();
  }

  shouldDisplayNewMailForm(): boolean {
    return this.selectedFolder?.isEqual(FolderType.NEW_MESSAGE) ?? false;
  }

  private observeResolvedFolderStructure(): void {
    this.activatedRoute.data
      .pipe(this.takeUntilDestroyed())
      .subscribe((folderType: Data) => {
        const folderTypes = Object.assign(
          {},
          folderType?.foldersStructure?.folderTypes
        );

        this.folders = this.convertFolderTypesToFolderOptions(folderTypes);
        this.changeDetectorRef.detectChanges();
      });
  }

  private observeFolderMessages(): void {
    if (
      !this.selectedFolder ||
      this.selectedFolder?.isEqual(FolderType.NEW_MESSAGE)
    ) {
      return;
    }

    this.mailService
      .getFolderMessageList(
        this.selectedFolder.type,
        this.pagination?.currentPage,
        this.pagination?.itemsPerPage
      )
      .pipe(take(1))
      .subscribe((folderMessages: Array<FolderMessageDto>) => {
        this.mailList = folderMessages;
        this.changeDetectorRef.detectChanges();
      });
  }

  private convertFolderTypesToFolderOptions(
    folderTypes: FolderTypes
  ): Array<FolderOption> {
    const targetFolderOptions = [];

    for (const [_key, value] of Object.entries(folderTypes)) {
      const folderOption = new FolderOption(
        value.type,
        value.totalCount,
        value.readCount
      );
      targetFolderOptions.push(folderOption);
    }

    return targetFolderOptions;
  }
}
