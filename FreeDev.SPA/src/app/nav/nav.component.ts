import { Component, OnInit } from '@angular/core';
import {
  faCog,
  faHome,
  faPlusCircle,
  faSearch,
  faSignOutAlt,
  faUser,
  faUserEdit,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';
import { NotyService } from '../services/noty.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  icons: Array<IconDefinition> = [
    faHome,
    faUserEdit,
    faPlusCircle,
    faSignOutAlt,
    faPlusCircle,
    faSearch,
    faUser,
    faCog,
  ];

  constructor(
    readonly localStorageService: LocalStorageService,
    private readonly authServ: AuthService,
    private readonly noty: NotyService
  ) {}

  ngOnInit(): void {}

  logout(): void {
    this.authServ.logout();
    this.noty.success('You have been logged out');
  }
}
