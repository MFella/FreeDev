import { TestBed } from '@angular/core/testing';

import { OfferDetailResolver } from './offer-detail.resolver';

describe('OfferDetailResolver', () => {
  let resolver: OfferDetailResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(OfferDetailResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
