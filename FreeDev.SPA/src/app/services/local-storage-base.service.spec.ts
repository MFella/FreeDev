import { TestBed } from '@angular/core/testing';

import { LocalStorageBaseService } from './local-storage-base.service';

describe('LocalStorageBaseService', () => {
  let service: LocalStorageBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
