import { MessagesUserListRightClickItemsResolver } from './../infrastructure/right-click-dropdown/messagesUserListRightClickItemsResolver';
import { CurrentLoggedUser } from './../../../../FreeDev.API/dist/types/logged-users/currentLoggedUser.d';
import { CallService } from './../services/call.service';
import { CallComponent } from './../call/call.component';
import { LocalStorageService } from './../services/local-storage.service';
import { Pagination } from './../types/pagination';
import {
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
import { ActivatedRoute, Data, Router } from '@angular/router';
import { UserToMessageListDto } from '../dtos/users/userToMessageListDto';
import { ResolverPagination } from '../types/resolvedPagination';
import { UsersService } from '../services/users.service';
import { MessageResponseDto } from '../dtos/messages/messageResponseDto';
import { debounceTime, map, switchMap, take } from 'rxjs/operators';
import { timer } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DecisionCallComponent } from '../decision-call/decision-call.component';
import { VisibleUserActiveTimeCalculator } from '../utils/visibleUserActiveTimeCalculator';
import { DropdownItem } from '../infrastructure/types/dropdownItem';
import { MenuItem } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';
import { MessagesService } from '../services/messages.service';
import { MessageToSendDto } from '../types/message/messageToSendDto';
import { MessageType } from '../types/message/messageType';

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

  @ViewChild('rightClickUserContextMenu')
  rightClickUserContextMenu!: ElementRef;

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

  storedCallRequestModalRef!: DynamicDialogRef | null;

  storedCallModalRef!: DynamicDialogRef | null;

  visibleLoggedInUsers: Array<CurrentLoggedUser> = [];

  lastRightClickUserId: string = '';

  searchRolesNames: Array<{ name: string }> = [
    { name: 'Both' },
    { name: 'Developer' },
    { name: 'Hunter' },
  ];

  selectedUserFromRightClickMenu!: any;

  dropdownRightClickItems: Array<MenuItem> = [];

  friendIds: Set<string> = new Set<string>();

  constructor(
    private readonly wsServ: WsService,
    private readonly authServ: AuthService,
    private readonly route: ActivatedRoute,
    private readonly lsServ: LocalStorageService,
    private readonly usersServ: UsersService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly dialogService: DialogService,
    private readonly callServ: CallService,
    private readonly messagesUserListRightClickItemsResolver: MessagesUserListRightClickItemsResolver,
    private readonly router: Router,
    private readonly messageServ: MessagesService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((resolvedMessagePageInfo: Data) => {
      this.friendIds = new Set(
        resolvedMessagePageInfo.users.friendsOrRequestedFriendsIds
      );
      this.userList = resolvedMessagePageInfo.users.result ?? [];
      this.numberOfTotalRecords =
        resolvedMessagePageInfo.users.numberOfTotalRecords;
      this.pagination = this.getDefaultPagination();
      this.emitVisibleUsersIdsFromList();
      this.changeDetectorRef.detectChanges();
    });

    this.observePrivateMessage();
    this.observeIncomingCall();
    this.observeDialogClosed();
    this.observeLoggedInUsers();
    this.observeRightClickDropdownItems();
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
        console.log(paginatedList);
        this.friendIds = new Set(paginatedList.friendsOrRequestedFriendsIds);
        this.emitVisibleUsersIdsFromList();
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
    if (this.storedCallModalRef || this.storedCallRequestModalRef) {
      return;
    }

    this.storedCallModalRef = this.dialogService.open(CallComponent, {
      data: {
        guestAvatarUrl: this.selectedUser?.avatar?.url,
        yourAvatarUrl: this.authServ.storedUser?.userAvatar,
        peerId: this.selectedUser?._id,
      },
      showHeader: false,
      width: '90%',
    });

    this.wsServ.startMediaCall(this.selectedUser?._id ?? '');
  }

  startRequestCall(guestAvatarUrl = '', guestName = ''): void {
    if (this.storedCallModalRef || this.storedCallRequestModalRef) {
      return;
    }

    this.storedCallRequestModalRef = this.dialogService.open(
      DecisionCallComponent,
      {
        data: {
          guestAvatarUrl,
          guestName,
        },
        header: 'Incoming call',
        width: '50%',
      }
    );
    this.observeCloseOfConnection(this.storedCallRequestModalRef);
  }

  isUserLoggedIn(userId: string): boolean {
    const visibleLoggedInUser = this.visibleLoggedInUsers.find(
      (user: CurrentLoggedUser) => user.id === userId
    );
    return (visibleLoggedInUser as any)?.isActive;
  }

  getUserTextActiveStatus(userId: string): string {
    const visibleUser = this.visibleLoggedInUsers.find(
      (user: CurrentLoggedUser) => user.id === userId
    );
    if (!visibleUser) {
      return 'Offline';
    }

    if (!visibleUser.isActive) {
      const lastLogged = VisibleUserActiveTimeCalculator.getClosestTimePeriod(
        visibleUser.lastLogged
      );
      return 'Last active ' + lastLogged;
    } else {
      return 'Active';
    }
  }

  showRightClickMenu(
    contextMenu: ContextMenu,
    event: MouseEvent,
    selectedUserId: string
  ): void {
    this.lastRightClickUserId = selectedUserId;
    this.dropdownRightClickItems = this.getPossibleRightClickDropdownItems(
      this.friendIds.has(this.lastRightClickUserId)
    );
    contextMenu.show(event);
    event.stopPropagation();
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

  private observeIncomingCall(): void {
    this.wsServ.observeIncomingCall().subscribe((response: any) => {
      if (
        response.key === this.authServ?.storedUser?._id &&
        !this.storedCallModalRef
      ) {
        this.storedCallRequestModalRef = this.dialogService.open(
          DecisionCallComponent,
          {
            data: {
              guestAvatarUrl: this.selectedUser?.avatar?.url,
              yourAvatarUrl: this.authServ.storedUser?.userAvatar,
              peerId: this.selectedUser?._id,
            },
            showHeader: false,
            width: '90%',
          }
        );
      }
    });
  }

  private observeLoggedInUsers(): void {
    this.wsServ
      .observeLoggedInUsers()
      .subscribe((loggedInUsers: Array<any>) => {
        this.visibleLoggedInUsers = loggedInUsers;
      });
  }

  private observeDialogClosed(): void {
    this.callServ
      .getIsCallEnded()
      .pipe(debounceTime(450))
      .subscribe(() => {
        this.clearDynamicDialogRefs();
      });
  }

  private clearDynamicDialogRefs(): void {
    this.storedCallRequestModalRef = null;
    this.storedCallModalRef = null;
  }

  private emitVisibleUsersIdsFromList(): void {
    const usersIdsFromList = this.userList.map(
      (user: UserToMessageListDto) => user._id
    );
    this.wsServ.emitVisibleUsersFromList(usersIdsFromList);
  }

  private observeRightClickDropdownItems(): void {
    this.messagesUserListRightClickItemsResolver
      .getItemList(this.getPossibleRightClickDropdownItems(true))
      .pipe(take(1))
      .subscribe((dropdownRightClickItems: Array<DropdownItem>) => {
        this.dropdownRightClickItems = dropdownRightClickItems;
      });
  }

  private getPossibleRightClickDropdownItems(
    areFriends: boolean
  ): Array<DropdownItem> {
    return [
      new DropdownItem('View Profile', 'pi pi-search', () =>
        this.navigateToUserProfile()
      ),
      new DropdownItem(
        'Add Friend',
        'pi pi-plus-circle',
        () => this.addProfileToContact(),
        areFriends
      ),
    ];
  }

  private navigateToUserProfile(): void {
    this.router.navigateByUrl(`profile?id=${this.lastRightClickUserId}`);
  }

  private addProfileToContact(): void {
    const messageToSendDto = new MessageToSendDto(
      this.lastRightClickUserId,
      new Date(),
      MessageType.INVITE,
      ''
    );

    this.messageServ
      .sendMessageToUser(messageToSendDto)
      .pipe(take(1))
      .subscribe((isSaved: boolean) => {
        if (isSaved) {
          this.friendIds.add(this.lastRightClickUserId);
        }
      });
  }
}
