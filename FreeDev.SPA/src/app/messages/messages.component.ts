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
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { UserToMessageListDto } from '../dtos/users/userToMessageListDto';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  icons: Array<IconDefinition> = [faSearch, faPaperPlane];

  userList: Array<UserToMessageListDto> = [];

  userMessage!: string;

  receiverId: string = '';

  pagination!: Pagination;

  numbers: Array<number> = [1, 2, 3, 4, 5];

  searchRolesNames: Array<{ name: string }> = [
    { name: 'Developer' },
    { name: 'Hunter' },
    { name: 'Both' },
  ];

  constructor(
    private readonly wsServ: WsService,
    private readonly authServ: AuthService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.wsServ.joinRoom('helloThere');
    this.route.data
      .pipe(map((res) => res?.users ?? []))
      .subscribe((userRoomList: Array<UserToMessageListDto>) => {
        this.userList = userRoomList;
        console.log(this.userList);
      });
  }

  pageChanged(pageNumber: number): void {
    this.pagination.currentPage = pageNumber;
  }

  findUser(): void {}

  sendMessage(): void {
    const messageToCreateDto: MessageToCreateDto = {
      content: this.userMessage,
      senderId: this.authServ.storedUser?._id,
      receiverId: this.receiverId,
    };
    // function from wsServ //
  }
}
