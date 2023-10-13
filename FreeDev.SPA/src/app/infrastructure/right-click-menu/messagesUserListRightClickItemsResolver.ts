import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DropdownItem } from '../types/dropdownItem';
import { RightClickItemResolver } from './rightClickItemsResolver';

@Injectable()
export class MessagesUserListRightClickItemsResolver
  implements RightClickItemResolver
{
  getItemList(
    possbleDropdownItems: Array<DropdownItem>
  ): Observable<Array<DropdownItem>> {
    return of(
      possbleDropdownItems.map((possibleDropdownItem: DropdownItem) => {
        return possibleDropdownItem;
      })
    );
  }
}
