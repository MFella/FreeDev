import { Component, Input, OnInit } from '@angular/core';
import { FolderType } from 'src/app/types/contacts/folderType';

@Component({
  selector: 'mail-list',
  templateUrl: './mail-list.component.html',
  styleUrls: ['./mail-list.component.scss'],
})
export class MailListComponent implements OnInit {
  @Input()
  mailList!: Array<any>;

  @Input()
  folder!: FolderType;

  constructor() {}

  ngOnInit(): void {}

  trackByFn(index: number, item: any): number {
    return index;
  }
}
