/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DecisionCallComponent } from './decision-call.component';

describe('DecisionCallComponent', () => {
  let component: DecisionCallComponent;
  let fixture: ComponentFixture<DecisionCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecisionCallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
