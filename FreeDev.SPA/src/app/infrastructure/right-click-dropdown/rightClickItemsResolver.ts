import { Observable } from 'rxjs';
import { DropdownItem } from '../types/dropdownItem';

export interface RightClickItemResolver {
  getItemList(
    possbleActionCallbacks: Array<Function>
  ): Observable<Array<DropdownItem>>;
}
