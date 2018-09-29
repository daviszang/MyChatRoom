import { TestBed, inject } from '@angular/core/testing';

import { ChatSocketService } from './chat-socket.service';

describe('ChatSocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatSocketService]
    });
  });

  it('should be created', inject([ChatSocketService], (service: ChatSocketService) => {
    expect(service).toBeTruthy();
  }));
});
