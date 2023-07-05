import { TestBed } from '@angular/core/testing';

import { FolderStructureResolver } from './folder-structure.resolver';

describe('FolderStructureResolver', () => {
  let resolver: FolderStructureResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(FolderStructureResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
