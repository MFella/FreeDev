import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Component, Input, OnInit, Output } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { Subject } from 'rxjs';

@Component({
  selector: 'selected-badge',
  templateUrl: './selected-badge.component.html',
  styleUrls: ['./selected-badge.component.scss'],
  host: {
    class: 'selected-badge',
  },
})
export class SelectedBadgeComponent implements OnInit {
  @Input()
  id!: string;

  @Input()
  label!: string;

  @Output()
  deleteAction$: Subject<string> = new Subject();

  closeSign: IconDefinition = faTimes;

  constructor() {}

  ngOnInit() {}

  deleteSelection(): void {
    this.deleteAction$.next(this.id);
  }
}
