import { TestBed } from '@angular/core/testing';

import { UsersChatListResolver } from './users-chat-list.resolver';

describe('UsersChatListResolver', () => {
  let resolver: UsersChatListResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(UsersChatListResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
