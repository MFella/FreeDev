import { LocalStorageService } from './../services/local-storage.service';
import { Pagination } from './../types/pagination';
import { Component, OnInit } from '@angular/core';
import {
  faPaperPlane,
  faSearch,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { WsService } from '../services/ws.service';
import { MessageToCreateDto } from '../dtos/messages/messageToCreateDto';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Data } from '@angular/router';
import { UserToMessageListDto } from '../dtos/users/userToMessageListDto';
import { ResolverPagination } from '../types/resolvedPagination';
import { UsersService } from '../services/users.service';
import { MessageResponseDto } from '../dtos/messages/messageResponseDto';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  private static readonly MESSAGE_LS_PREFIX: string = 'messages_user_list_';

  messages: Array<MessageResponseDto> = [];

  icons: Array<IconDefinition> = [faSearch, faPaperPlane];

  userList: Array<UserToMessageListDto> = [];

  userMessage!: string;

  receiverId: string = '';

  pagination!: Pagination;

  numberOfTotalRecords: number = 10;

  rowsPerPageOptions: Array<number> = [2, 5, 10];

  searchRolesNames: Array<{ name: string }> = [
    { name: 'Developer' },
    { name: 'Hunter' },
    { name: 'Both' },
  ];

  constructor(
    private readonly wsServ: WsService,
    private readonly authServ: AuthService,
    private readonly route: ActivatedRoute,
    private readonly lsServ: LocalStorageService,
    private readonly usersServ: UsersService
  ) {}

  ngOnInit() {
    this.wsServ.onlyJoin(this.authServ.storedUser?._id);
    this.route.data.subscribe((resolvedMessagePageInfo: Data) => {
      this.userList = resolvedMessagePageInfo.users.result ?? [];
      this.numberOfTotalRecords =
        resolvedMessagePageInfo.users.numberOfTotalRecords;
      console.log(this.userList);
      this.pagination =
        resolvedMessagePageInfo.pagination ?? this.getDefaultPagination();
    });

    this.observePrivateMessage();
  }

  joinSelectedUserRoom(userId: string): void {
    this.receiverId = userId;
  }

  pageChanged(resolvedPagination: ResolverPagination): void {
    this.pagination = this.parseResolvedPagination(resolvedPagination);
    this.lsServ.setPagination(
      MessagesComponent.MESSAGE_LS_PREFIX,
      this.pagination
    );
    this.usersServ
      .getUserList(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe((paginatedList: any) => {
        this.userList = paginatedList.result ?? [];
        this.numberOfTotalRecords = paginatedList.numberOfTotalRecords;
      });
  }

  findUser(): void {}

  sendMessage(): void {
    const messageToCreateDto: MessageToCreateDto = {
      content: this.userMessage,
      sender: this.authServ.storedUser?._id,
      receiver: this.receiverId,
    };
    // function from wsServ //
    this.wsServ.sendPrivateMessage(messageToCreateDto);
    this.userMessage = '';
  }

  private parseResolvedPagination(
    resolvedPagination: ResolverPagination
  ): Pagination {
    const itemsPerPage = resolvedPagination.rows;
    const currentPage = resolvedPagination.page;
    return {
      itemsPerPage,
      currentPage,
    };
  }

  private getDefaultPagination(): Pagination {
    return (
      this.lsServ.getPagination(MessagesComponent.MESSAGE_LS_PREFIX) ?? {
        itemsPerPage: 2,
        currentPage: 0,
      }
    );
  }

  private observePrivateMessage(): void {
    this.wsServ
      .observePrivateMessage()
      .subscribe((response: MessageResponseDto) => {
        console.log('observe');
        this.messages.push(response);
      });
  }
}
