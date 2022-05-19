import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export abstract class LocalStorageBaseService {
  constructor() {}

  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  get(key: string): any {
    const objectFromLS = localStorage.getItem(key) ?? JSON.stringify('');
    return JSON.parse(objectFromLS);
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
