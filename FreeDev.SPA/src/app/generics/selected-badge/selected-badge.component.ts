import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

@Component({
  selector: 'selected-badge',
  templateUrl: './selected-badge.component.html',
  styleUrls: ['./selected-badge.component.scss'],
})
export class SelectedBadgeComponent implements OnInit {
  @Input()
  label!: string;

  @Output()
  deleteAction$: EventEmitter<void> = new EventEmitter();

  closeSign: IconDefinition = faTimes;

  constructor() {}

  ngOnInit() {}

  deleteSelection(): void {
    this.deleteAction$.emit();
  }
}
