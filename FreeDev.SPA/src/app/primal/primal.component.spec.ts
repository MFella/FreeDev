import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimalComponent } from './primal.component';

describe('PrimalComponent', () => {
  let component: PrimalComponent;
  let fixture: ComponentFixture<PrimalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
