import { LocalStorageService } from './../services/local-storage.service';
import { Pagination } from './../types/pagination';
import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, AfterViewChecked {
  @ViewChild('paginator')
  paginator!: any;

  private static readonly MESSAGE_LS_PREFIX: string = 'messages_user_list_';

  messages: Array<MessageResponseDto> = [];

  icons: Array<IconDefinition> = [faSearch, faPaperPlane];

  userList: Array<UserToMessageListDto> = [];

  userMessage!: string;

  receiverId: string = '';

  pagination!: Pagination;

  numberOfTotalRecords: number = 10;

  rowsPerPageOptions: Array<number> = [2, 5, 10];

  privateRoomKey: string = '';

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
    private readonly usersServ: UsersService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.data.subscribe((resolvedMessagePageInfo: Data) => {
      this.userList = resolvedMessagePageInfo.users.result ?? [];
      this.numberOfTotalRecords =
        resolvedMessagePageInfo.users.numberOfTotalRecords;
      this.pagination = this.getDefaultPagination();
      this.changeDetectorRef.detectChanges();
    });

    this.observePrivateMessage();
  }

  ngAfterViewChecked(): void {
    // this.paginator.changePageToFirst(null);
    this.pagination = this.getDefaultPagination();
    this.changeDetectorRef.detectChanges();
  }

  getUserRoomKey(userId: string): void {
    this.usersServ
      .getUserChatKeyRoom(userId)
      .pipe(
        switchMap((response: { key: string }) => {
          this.receiverId = userId;
          this.wsServ.joinUserRoom(response.key);
          this.privateRoomKey = response.key;
          this.messages = [];
          return this.usersServ.getSavedMessaged(response.key).pipe(
            map((res: Array<any>) => {
              const newResponse = res.map((element: any) => {
                return {
                  message: element.content,
                  sendTime: element.sendTime,
                  sender: element.sender,
                  amIOwner: element.sender === this.authServ.storedUser._id,
                };
              });
              return newResponse;
            })
          );
        })
      )
      .subscribe((response: Array<any>) => {
        this.messages = response;
      });
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
      key: this.privateRoomKey,
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
    return this.lsServ.getPagination(MessagesComponent.MESSAGE_LS_PREFIX);
  }

  private observePrivateMessage(): void {
    this.wsServ
      .observePrivateMessage()
      .pipe(
        map((response: any) => {
          const newResponse = {
            amIOwner: this.authServ.storedUser._id === response.sender,
            ...response,
          };
          return newResponse;
        })
      )
      .subscribe((response: MessageResponseDto) => {
        this.messages.push(response);
      });
  }
}
