import { TestBed } from '@angular/core/testing';

import { OfferListResolver } from './offer-list.resolver';

describe('OfferListResolver', () => {
  let resolver: OfferListResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(OfferListResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
