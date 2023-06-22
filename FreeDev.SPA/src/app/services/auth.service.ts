import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from 'src/environments/environment';
import { Observable, of, Subject } from 'rxjs';
import { AfterLoginInfoDto } from '../dtos/users/afterLoginInfoDto';
import { take, tap } from 'rxjs/operators';
import moment from 'moment';
import { LocalStorageService } from './local-storage.service';
import { UserToCreateDto } from '../dtos/users/userToCreateDto';
import { UserToLoginDto } from '../dtos/users/userToLoginDto';
import { UserToProfileDto } from '../dtos/users/userToProfileDto';
import { DeveloperToCreateDto } from '../dtos/users/developerToCreateDto';
import { HunterToCreateDto } from '../dtos/users/hunterToCreateDto';
import { WsService } from './ws.service';
import { CurrentLoggedUser } from '../types/logged-users/currentLoggedUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private readonly http: HttpClient,
    private readonly localStorageService: LocalStorageService,
    private readonly wsServ: WsService
  ) {
    const userFromLS: any = this.localStorageService.getUser();
    if (userFromLS) {
      this.storedUser = userFromLS;
    }
  }

  loginAction$: Subject<void> = new Subject();

  storedUser: any = null;

  createUser(
    userToCreateDto: UserToCreateDto | null,
    contractType: string
  ): Observable<any> {
    switch (contractType) {
      case 'contract-job':
        return this.createDeveloper(userToCreateDto);
      case 'contract-empl':
        return this.createHunter(userToCreateDto);
      default:
        return of(null);
    }
  }

  login(userToLoginDto: UserToLoginDto): Observable<AfterLoginInfoDto> {
    return this.http
      .post<AfterLoginInfoDto>(this.getRestUrl() + 'auth/login', userToLoginDto)
      .pipe(
        take(1),
        tap((authResult: AfterLoginInfoDto) => {
          this.setSession(authResult);
          this.wsServ.emitLogAction(this.getLogAction(true));
        })
      );
  }

  logout(): void {
    this.wsServ.emitLogAction(this.getLogAction(false));
    this.storedUser = null;
    this.localStorageService.removeAuthCredentials();
  }

  getUserProfile(userId: string): Observable<UserToProfileDto> {
    return this.http
      .get<UserToProfileDto>(this.getRestUrl() + `auth/profile/${userId}`)
      .pipe(take(1));
  }

  checkEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(
      this.getRestUrl() + `auth/check-email?email=${email}`
    );
  }

  getStoredUser(): any {
    return this.storedUser;
  }

  private createDeveloper(
    developerToCreateDto: DeveloperToCreateDto | null
  ): Observable<any> {
    return this.http.post(
      this.getRestUrl() + 'auth/developer',
      developerToCreateDto
    );
  }

  private createHunter(
    hunterToCreateDto: HunterToCreateDto | null
  ): Observable<any> {
    return this.http.post(this.getRestUrl() + 'auth/hunter', hunterToCreateDto);
  }

  private getRestUrl(): string {
    return (env as any).backendUrl;
  }

  private setSession(authResult: AfterLoginInfoDto): void {
    this.storedUser = authResult.user;
    const expirationDate = moment().add(authResult.expiresIn, 'second');
    this.localStorageService.setAuthCredentials([
      JSON.stringify(this.storedUser),
      authResult.access_token,
      JSON.stringify(expirationDate.valueOf()),
    ]);
  }

  private getLogAction(isActive: boolean): CurrentLoggedUser {
    const id = this.storedUser?._id;
    return {
      id,
      lastLogged: new Date(),
      isActive,
    };
  }
}
