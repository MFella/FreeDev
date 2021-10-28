/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NotyService } from './noty.service';

describe('Service: Noty', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotyService]
    });
  });

  it('should ...', inject([NotyService], (service: NotyService) => {
    expect(service).toBeTruthy();
  }));
});
