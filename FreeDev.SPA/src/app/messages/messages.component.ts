import { MessagesUserListRightClickItemsResolver } from '../infrastructure/right-click-menu/messagesUserListRightClickItemsResolver';
import { CallService } from '../services/call.service';
import { CallComponent } from '../call/call.component';
import { LocalStorageService } from '../services/local-storage.service';
import { Pagination } from '../types/pagination';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
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
import { PartialMessage, UsersService } from '../services/users.service';
import {
  debounceTime,
  filter,
  map,
  switchMap,
  take,
  takeUntil,
} from 'rxjs/operators';
import { Subject, timer } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DecisionCallComponent } from '../decision-call/decision-call.component';
import { VisibleUserActiveTimeCalculator } from '../utils/visibleUserActiveTimeCalculator';
import { DropdownItem } from '../infrastructure/types/dropdownItem';
import { MenuItem } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';
import { DirectMessageToSendDto } from '../types/message/directMessageToSendDto';
import { MessageType } from '../types/message/messageType';
import { NotyService } from '../services/noty.service';
import { MailService } from '../services/mail.service';
import { Roles } from '../types/roles.enum';
import { CancellationCallMessage } from '../types/call/cancellationCallMessage';
import { CurrentLoggedUser } from '../types/logged-users/currentLoggedUser';

type ReplyMessage = {
  content: string;
  replier: string;
  id: string;
};

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('paginator')
  paginator!: any;

  @ViewChild('messagesContainer')
  messagesContainer!: ElementRef;

  @ViewChild('messagesWrapper')
  messagesWrapper!: ElementRef;

  @ViewChildren('messageRef')
  messageRefs!: QueryList<ElementRef>;

  @ViewChild('userItemContextMenu')
  userItemContextMenu!: ContextMenu;

  @ViewChild('messageItemContextMenu')
  messageItemContextMenu!: ContextMenu;

  @ViewChild('replyMessageContainer')
  replyMessageContainer: ElementRef | undefined;

  private openedMessageItemContextMenu!: ContextMenu | null;
  private openedUserItemContextMenu!: ContextMenu | null;

  private destroy$: Subject<void> = new Subject<void>();

  private static readonly SCROLL_TIME_OFFSET = 20;

  private static readonly MESSAGE_LS_PREFIX: string = 'messages_user_list_';

  private static readonly CONTEXT_MENU_SHOWED_CSS_CLASS: string =
    'context-menu-showed';

  messages: Array<PartialMessage> = [];

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

  lastRightClickUserRole: Roles = Roles.NONE;

  areMessagesLoading: boolean = true;

  searchRolesNames: Array<{ name: string }> = [
    { name: 'Both' },
    { name: 'Developer' },
    { name: 'Hunter' },
  ];

  dropdownRightClickItems: Array<MenuItem> = [];
  messageMoreMenuLeftClickItems: Array<MenuItem> = [];

  friendIds: Set<string> = new Set<string>();

  selectedReplyMessage!: ReplyMessage | null;
  shouldDisplaySelectedReplyMessage: boolean = false;

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
    private readonly mailService: MailService,
    private readonly notyService: NotyService
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
    this.observeCallCancelled();
    this.observeDialogClosed();
    this.observeLoggedInUsers();
    this.observeRightClickDropdownItems();
    this.resolveSelectedUserFromLocalStorage();
  }

  ngAfterViewInit(): void {
    this.pagination = this.getDefaultPagination();
    setTimeout(() => this.paginator.changePage(this.pagination.currentPage), 0);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  observeUserRoomKey(
    userId: string,
    eventSource: 'localStorage' | 'click'
  ): void {
    if (this.selectedUser?._id === userId && eventSource === 'click') {
      return;
    }

    this.usersServ
      .getUserChatKeyRoom(userId)
      .pipe(
        take(1),
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
      .subscribe((response: Array<PartialMessage>) => {
        this.messages = response;
        this.areMessagesLoading = false;
        this.selectedUser = this.userList.find((user) => user._id === userId);
        if (this.selectedUser) {
          this.lsServ.setMessagesSelectedUserId(
            MessagesComponent.MESSAGE_LS_PREFIX,
            userId
          );
        }
        this.changeDetectorRef.detectChanges();
        this.scrollToBottom();
      });
  }

  fetchMessagesOnScroll(): void {
    // close message item context menu
    this.closeVisibleDropdowns();

    if (this.messagesContainer.nativeElement?.scrollTop) {
      return;
    }

    // zaciagnij dodatkowe wiadomosci
    this.messageNumberFrom += this.messagesToFetchStep;
    this.areMessagesLoading = true;
    this.usersServ
      .fetchPartialMessages(
        this.messageNumberFrom,
        this.messagesToFetchStep,
        this.privateRoomKey
      )
      .subscribe((response: Array<PartialMessage>) => {
        // TODO: Dont scroll if new messages arrived
        this.areMessagesLoading = false;
        this.messages = [...response, ...this.messages];
        this.changeDetectorRef.detectChanges();
      });
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
      .subscribe((messages: Array<PartialMessage>) => {
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
      replyMessage: this.selectedReplyMessage?.id,
    };
    this.wsServ.sendPrivateMessage(messageToCreateDto);
    this.userMessage = '';

    this.clearSelectedReplyMessage();
  }

  startVoiceCall(): void {
    if (
      this.storedCallModalRef ||
      this.storedCallRequestModalRef ||
      !this.selectedUser?._id
    ) {
      return;
    }

    this.storedCallModalRef = this.dialogService.open(CallComponent, {
      data: {
        guestAvatarUrl: this.selectedUser?.avatar?.url,
        yourAvatarUrl: this.authServ.storedUser?.userAvatar,
        guestId: this.selectedUser?._id,
      },
      showHeader: false,
      width: '90%',
    });

    this.wsServ.startMediaCall(
      this.selectedUser?._id ?? '',
      this.authServ.getStoredUser()._id
    );
  }

  startRequestCall(
    guestAvatarUrl: string = '',
    guestName: string = '',
    guestId: string
  ): void {
    if (this.storedCallModalRef || this.storedCallRequestModalRef) {
      return;
    }

    this.storedCallRequestModalRef = this.dialogService.open(
      DecisionCallComponent,
      {
        data: {
          guestAvatarUrl,
          guestName,
          guestId,
        },
        header: 'Incoming call',
        width: '50%',
      }
    );
    this.observeCloseOfConnection(this.storedCallRequestModalRef);
  }

  isUserLoggedIn(userId: string | undefined): boolean {
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
    selectedUserId: string,
    userRole: Roles
  ): void {
    this.lastRightClickUserId = selectedUserId;
    this.lastRightClickUserRole = userRole;
    this.dropdownRightClickItems = this.getUserRightClickDropdownItems(
      this.friendIds.has(this.lastRightClickUserId)
    );

    this.openedUserItemContextMenu = contextMenu;
    contextMenu.show(event);
    event.stopPropagation();
  }

  isStreamingActionDisabled(): boolean {
    return (
      this.privateRoomKey === '' || !this.isUserLoggedIn(this.selectedUser?._id)
    );
  }

  getStreamActionTooltip(streamAction: 'call' | 'video'): string {
    return this.isStreamingActionDisabled()
      ? `Can't start ${streamAction} right now`
      : `Start ${streamAction}`;
  }

  onMessageContextMenuHide(): void {
    const visibleMessageMoreButtons = document.querySelectorAll(
      '.' + MessagesComponent.CONTEXT_MENU_SHOWED_CSS_CLASS
    );

    if (!visibleMessageMoreButtons.length) {
      return;
    }

    visibleMessageMoreButtons.forEach((button) =>
      button.classList.remove(MessagesComponent.CONTEXT_MENU_SHOWED_CSS_CLASS)
    );
    this.changeDetectorRef.detectChanges();
  }

  showLeftClickMoreContextMenu(
    contextMenu: ContextMenu,
    event: MouseEvent,
    message: PartialMessage
  ): void {
    if (this.openedMessageItemContextMenu) {
      this.openedMessageItemContextMenu.hide();
    }
    this.openedMessageItemContextMenu = contextMenu;
    this.messageMoreMenuLeftClickItems =
      this.getMessageLeftClickDropdownItems();
    contextMenu.show(event);
    event.stopPropagation();

    const eventTarget = event.target as Element;
    if (eventTarget) {
      const messageMoreButton = eventTarget.closest('button');
      messageMoreButton?.classList?.add(
        MessagesComponent.CONTEXT_MENU_SHOWED_CSS_CLASS
      );
    }

    this.selectedReplyMessage = {
      content: message.content,
      replier: message.amIOwner
        ? 'You'
        : this.selectedUser?.name + ' ' + this.selectedUser?.surname,
      id: message.id,
    };
  }

  trackByMessageId(_index: number, message: PartialMessage): string {
    return message.content;
  }

  closeSelectedReplyMessage(): void {
    this.replyMessageContainer?.nativeElement?.classList?.add(
      'slide-down-animation'
    );
    setTimeout(() => {
      this.clearSelectedReplyMessage();
      this.changeDetectorRef.detectChanges();
    }, 100);
  }

  private clearSelectedReplyMessage(): void {
    this.shouldDisplaySelectedReplyMessage = false;
    this.selectedReplyMessage = null;
  }

  private observeCloseOfConnection(ref: DynamicDialogRef): void {
    ref.onClose.subscribe((response: any) => {});
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
          return {
            amIOwner: this.authServ.storedUser._id === response.sender,
            sendTimePretty: '',
            ...response,
          };
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((response: PartialMessage) => {
        this.messages.push(response);
        this.scrollToBottom();
        this.changeDetectorRef.detectChanges();
      });
  }

  private observeCallCancelled(): void {
    this.wsServ
      .observeCancellationOfCall()
      .pipe(takeUntil(this.destroy$))
      .pipe(
        filter(
          (cancellationCallMessage: CancellationCallMessage) =>
            cancellationCallMessage.sourceUserId ===
              this.authServ.getStoredUser()?._id ||
            cancellationCallMessage.targetUserId ===
              this.authServ.getStoredUser()?._id
        )
      )
      .subscribe(() => {
        this.storedCallRequestModalRef?.close();
        this.storedCallRequestModalRef?.destroy();
        this.storedCallModalRef?.close();
        this.storedCallModalRef?.destroy();
        this.storedCallModalRef = null;
        this.storedCallRequestModalRef = null;

        this.callServ.closeMediaCall();
        this.notyService.info('Call has been cancelled');
      });
  }

  private observeLoggedInUsers(): void {
    this.wsServ
      .observeLoggedInUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((loggedInUsers: Array<any>) => {
        this.visibleLoggedInUsers = loggedInUsers;
      });
  }

  private observeDialogClosed(): void {
    this.callServ
      .getIsCallEnded()
      .pipe(debounceTime(450), takeUntil(this.destroy$))
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
      .getItemList(this.getUserRightClickDropdownItems(true))
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((dropdownRightClickItems: Array<DropdownItem>) => {
        this.dropdownRightClickItems = dropdownRightClickItems;
      });
  }

  private getUserRightClickDropdownItems(
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

  private getMessageLeftClickDropdownItems(): Array<DropdownItem> {
    return [
      new DropdownItem(
        'Reply',
        'pi pi-reply',
        this.setShouldDisplaySelectedReplyMessage.bind(this)
      ),
      new DropdownItem('Delete', 'pi pi-trash', () => {}),
    ];
  }

  private setShouldDisplaySelectedReplyMessage(): void {
    this.shouldDisplaySelectedReplyMessage = true;
  }

  private navigateToUserProfile(): void {
    this.router.navigateByUrl(`profile?id=${this.lastRightClickUserId}`);
  }

  private addProfileToContact(): void {
    const titleInvitation = 'Invitation';
    const contentInvitation =
      'A want to be your friend. Add me to your contacts';
    const messageToSendDto = new DirectMessageToSendDto(
      this.lastRightClickUserId,
      MessageType.INVITE,
      titleInvitation,
      contentInvitation,
      this.lastRightClickUserRole
    );

    this.mailService
      .sendDirectMailMessage(messageToSendDto)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((isSaved: boolean) => {
        if (!isSaved) {
          return;
        }
        this.friendIds.add(this.lastRightClickUserId);
        this.notyService.success('Invitation has been sent');
      });
  }

  private resolveSelectedUserFromLocalStorage(): void {
    const selectedUserId: string = this.lsServ.getMessagesSelectedUserId(
      MessagesComponent.MESSAGE_LS_PREFIX
    );

    const userFromList = this.userList.find(
      (user) => user._id === selectedUserId
    );

    if (userFromList) {
      this.selectedUser = userFromList;
      this.observeUserRoomKey(this.selectedUser?._id, 'localStorage');
      return;
    }

    this.lsServ.removeMessagesSelectedUserId(
      MessagesComponent.MESSAGE_LS_PREFIX
    );
  }

  private closeVisibleDropdowns(): void {
    this.openedMessageItemContextMenu?.hide();
    this.openedUserItemContextMenu?.hide();
    this.openedMessageItemContextMenu = null;
    this.openedUserItemContextMenu = null;
  }
}
