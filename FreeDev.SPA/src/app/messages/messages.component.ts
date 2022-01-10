import { CallComponent } from './../call/call.component';
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
import { map, switchMap, take } from 'rxjs/operators';
import { timer } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DecisionCallComponent } from '../decision-call/decision-call.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  providers: [DialogService],
})
export class MessagesComponent implements OnInit, AfterViewInit {
  @ViewChild('paginator')
  paginator!: any;

  @ViewChild('messagesContainer')
  messagesContainer!: ElementRef;

  private static readonly SCROLL_TIME_OFFSET = 20;

  private static readonly MESSAGE_LS_PREFIX: string = 'messages_user_list_';

  messages: Array<MessageResponseDto> = [];

  icons: Array<IconDefinition> = [faSearch, faPaperPlane];

  userList: Array<UserToMessageListDto> = [];

  selectedUser!: UserToMessageListDto | undefined;

  userMessage!: string;

  receiverId: string = '';

  pagination!: Pagination;

  numberOfTotalRecords: number = 10;

  rowsPerPageOptions: Array<number> = [2, 5, 10];

  privateRoomKey: string = '';

  messageNumberFrom: number = 0;

  messagesToFetchStep: number = 10;

  selectedPersonType!: { name: string };

  searchUserPhrase!: string;

  searchRolesNames: Array<{ name: string }> = [
    { name: 'Both' },
    { name: 'Developer' },
    { name: 'Hunter' },
  ];

  constructor(
    private readonly wsServ: WsService,
    private readonly authServ: AuthService,
    private readonly route: ActivatedRoute,
    private readonly lsServ: LocalStorageService,
    private readonly usersServ: UsersService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly dialogService: DialogService
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

  ngAfterViewInit(): void {
    this.pagination = this.getDefaultPagination();
    setTimeout(() => this.paginator.changePage(this.pagination.currentPage), 0);
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
          this.messageNumberFrom = 0;
          return this.usersServ.fetchPartialMessages(
            this.messageNumberFrom,
            this.messagesToFetchStep,
            response.key
          );
        })
      )
      .subscribe((response: Array<any>) => {
        this.messages = response;
        this.selectedUser = this.userList.find((user) => user._id === userId);
        this.scrollToBottom();
      });
  }

  fetchMessagesOnScroll(): void {
    if (!this.messagesContainer.nativeElement.scrollTop) {
      // zaciagnij dodatkowe wiadomosci
      this.messageNumberFrom += this.messagesToFetchStep;
      this.usersServ
        .fetchPartialMessages(
          this.messageNumberFrom,
          this.messagesToFetchStep,
          this.privateRoomKey
        )
        .subscribe((response: Array<MessageResponseDto>) => {
          this.messages = [...response, ...this.messages];
        });
    }
  }

  pageChanged(resolvedPagination: ResolverPagination): void {
    this.pagination = this.parseResolvedPagination(resolvedPagination);
    this.lsServ.setPagination(
      MessagesComponent.MESSAGE_LS_PREFIX,
      this.pagination
    );
    this.usersServ
      .getFilteredUserList(
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.searchUserPhrase,
        this.selectedPersonType?.name?.toUpperCase()
      )
      .subscribe((paginatedList: any) => {
        this.userList = paginatedList.result ?? [];
        this.numberOfTotalRecords = paginatedList.numberOfTotalRecords;
      });
  }

  fetchPartialMessages(): void {
    if (this.privateRoomKey === '') return;

    this.usersServ
      .fetchPartialMessages(
        this.messageNumberFrom,
        this.messagesToFetchStep,
        this.privateRoomKey
      )
      .subscribe((messages: Array<MessageResponseDto>) => {
        this.messages = [...messages, ...this.messages];
      });
  }

  findUser(): void {
    // update pagination - currentPage is 0;
    this.pagination.currentPage = 0;

    this.usersServ
      .getFilteredUserList(
        0,
        this.pagination.itemsPerPage,
        this.searchUserPhrase,
        this.selectedPersonType?.name?.toUpperCase()
      )
      .subscribe(
        (response: { result: Array<any>; numberOfTotalRecords: number }) => {
          this.userList = response.result;
          this.numberOfTotalRecords = response.numberOfTotalRecords;
        }
      );
  }

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

  startVoiceCall(): void {
    const ref = this.dialogService.open(CallComponent, {
      data: {
        guestAvatarUrl: this.selectedUser?.avatar?.url,
        yourAvatarUrl: this.authServ.storedUser?.userAvatar,
      },
      showHeader: false,
      width: '90%',
    });
  }

  startRequestCall(guestAvatarUrl = '', guestName = ''): void {
    const ref = this.dialogService.open(DecisionCallComponent, {
      data: {
        guestAvatarUrl,
        guestName,
      },
      header: 'Incoming call',
      width: '50%',
    });
  }

  private observeCloseOfConnection(ref: DynamicDialogRef): void {
    ref.onClose.subscribe((response: any) => {
      console.log('do something after close...');
    });
  }

  private scrollToBottom(): void {
    timer(MessagesComponent.SCROLL_TIME_OFFSET).subscribe(() => {
      try {
        const listOfMsg = document.querySelectorAll(
          '.message-content-container'
        );

        if (
          this.messagesContainer.nativeElement?.scrollHeight &&
          listOfMsg[listOfMsg.length - 1]
        ) {
          this.messagesContainer.nativeElement.scrollTop =
            this.messagesContainer.nativeElement.scrollHeight +
            listOfMsg[listOfMsg.length - 1].scrollHeight;
        }
      } catch (err: unknown) {
        console.error(err);
      }
    });
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
        this.scrollToBottom();
      });
  }
}
