import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'toCapitalize'
})
export class ToCapitalizePipe implements PipeTransform {

  transform(value: string): string {
    return value.split('_').map((word: string) => word.charAt(0).toUpperCase()
      + word.slice(1).toLowerCase()).join(' ');
  }

}
