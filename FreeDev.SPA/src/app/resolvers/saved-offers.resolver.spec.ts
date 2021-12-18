import { TestBed } from '@angular/core/testing';

import { SavedOffersResolver } from './saved-offers.resolver';

describe('SavedOffersResolver', () => {
  let resolver: SavedOffersResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(SavedOffersResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
