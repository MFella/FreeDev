import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DropdownItem } from '../types/dropdownItem';
import { RightClickItemResolver } from './rightClickItemsResolver';

@Injectable()
export class MessagesUserListRightClickItemsResolver
  implements RightClickItemResolver
{
  getItemList(
    possbleActionCallbacks: Array<Function>
  ): Observable<Array<DropdownItem>> {
    return of(
      possbleActionCallbacks.map((possibleCallback: Function) => {
        return new DropdownItem('View Profile', 'pi pi-fw pi-search', () =>
          possibleCallback()
        );
      })
    );
  }
}
