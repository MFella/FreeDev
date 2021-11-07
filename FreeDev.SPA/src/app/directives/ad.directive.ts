import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[adPoint]',
})
export class AdDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
