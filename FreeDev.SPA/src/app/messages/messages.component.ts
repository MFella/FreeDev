import { Pagination } from './../types/pagination';
import { Component, OnInit } from '@angular/core';
import {
  faPaperPlane,
  faSearch,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { WsService } from '../services/ws.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  icons: Array<IconDefinition> = [faSearch, faPaperPlane];

  pagination!: Pagination;

  numbers: Array<number> = [1, 2, 3, 4, 5];

  constructor(private readonly wsServ: WsService) {}

  ngOnInit() {
    this.setPagination();
    this.wsServ.joinRoom('helloThere');
  }

  pageChanged(pageNumber: number): void {
    this.pagination.currentPage = pageNumber;
  }

  private setPagination(): void {
    this.pagination = {
      itemsPerPage: 2,
      currentPage: 1,
      totalItems: 10,
    };
  }
}
