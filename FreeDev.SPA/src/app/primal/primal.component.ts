import { Subject, Observable, MonoTypeOperatorFunction } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-primal',
  templateUrl: './primal.component.html',
  styleUrls: ['./primal.component.scss'],
})
export abstract class PrimalComponent implements OnDestroy {
  destroyed$: Subject<void> = new Subject<void>();

  constructor() {}

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  takeUntilDestroyed<T>(): MonoTypeOperatorFunction<T> {
    return (source$: Observable<T>) =>
      source$.pipe(takeUntil<T>(this.destroyed$));
  }
}
