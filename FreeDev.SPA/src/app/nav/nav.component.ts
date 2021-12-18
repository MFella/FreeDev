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
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  items!: MenuItem[];

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

  ngOnInit(): void {
    this.setNavItems();
  }

  logout(): void {
    this.authServ.logout();
    this.noty.success('You have been logged out');
    this.router.navigate(['home']);
  }

  navigateToProfile(): void {
    this.router.navigate(['profile'], {
      queryParams: { id: this.getUserId() },
    });
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

  private setNavItems(): void {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-user',
        routerLink: 'home',
      },
      {
        label: 'Add Offer',
        icon: 'pi pi-fw pi-plus',
        routerLink: 'add-offer',
      },
      {
        label: 'Messages',
        icon: 'pi pi-fw pi-comments',
        routerLink: 'messages',
      },
      {
        label: 'Search offers',
        icon: 'pi pi-fw pi-search',
        routerLink: 'search-offers',
      },
      {
        label: 'Login',
        icon: 'pi pi-fw pi-sign-in',
        routerLink: 'login',
      },
      {
        label: 'Sign up',
        icon: 'pi pi-fw pi-user-plus',
        routerLink: 'register',
      },
      {
        label: 'More Actions',
        icon: 'pi pi-fw pi-cog',
        styleClass: 'ml-auto',
        items: [
          {
            label: 'Profile',
            icon: 'pi pi-fw pi-user',
            command: () => this.navigateToProfile(),
          },
          {
            label: 'Saved',
            icon: 'pi pi-fw pi-heart',
            routerLink: 'saved-offers',
          },
          {
            label: 'Logout',
            icon: 'pi pi-fw pi-sign-out',
            command: () => this.logout(),
          },
        ],
      },
    ];
  }
}
