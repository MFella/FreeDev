import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  faCog,
  faComments,
  faHeart,
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
import { Roles } from '../types/roles.enum';

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
    faHeart,
    faComments,
  ];

  constructor(
    readonly localStorageService: LocalStorageService,
    private readonly authServ: AuthService,
    private readonly noty: NotyService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {}

  logout(): void {
    this.authServ.logout();
    this.noty.success('You have been logged out');
    this.router.navigate(['home']);
  }

  getUserId(): string {
    return this.authServ.storedUser?._id;
  }

  isUserDeveloper(): boolean {
    return this.localStorageService.getUser()?.role === Roles.DEVELOPER;
  }

  isUserHunter(): boolean {
    return this.localStorageService.getUser()?.role === Roles.HUNTER;
  }
}
