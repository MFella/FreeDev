import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DeveloperToCreateDto } from '../dtos/developerToCreateDto';
import { environment as env } from 'src/environments/environment';
import { HunterToCreateDto } from '../dtos/hunterToCreateDto';
import { UserToCreateDto } from '../dtos/userToCreateDto';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private http: HttpClient) { }


  createUser(userToCreateDto: UserToCreateDto | null, contractType: string): Observable<any> {

    switch(contractType) {
      case 'contract-job':
        return this.createDeveloper(userToCreateDto);
      case 'contract-empl':
        return this.createHunter(userToCreateDto);
      default:
        return of(null);
    }
  }

  private createDeveloper(developerToCreateDto: DeveloperToCreateDto | null): Observable<any> {
    console.log(developerToCreateDto);
    return this.http.post(this.getRestUrl() + 'users/developer', developerToCreateDto);
  }

  private createHunter(hunterToCreateDto: HunterToCreateDto | null): Observable<any> {
    return this.http.post(this.getRestUrl() + 'users/hunter', hunterToCreateDto);
  }

  private getRestUrl(): string {
    return env.backendUrl;
  }
}
