import { NotyService } from './../services/noty.service';
import { LocalStorageService } from './../services/local-storage.service';
import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly authServ: AuthService,
    private readonly noty: NotyService,
    private readonly router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = this.localStorageService.getToken();
    if (!token) {
      return false;
    }

    if (this.tokenExpired(token)) {
      this.authServ.logout();
      this.noty.info('Session expired - login again');
      this.router.navigate(['home']);
      return false;
    }

    return true;
  }

  private tokenExpired(token: string): boolean {
    const expiry = JSON.parse(atob(token.split('.')[1])).exp;
    return Math.floor(new Date().getTime() / 1000) >= expiry;
  }
}
