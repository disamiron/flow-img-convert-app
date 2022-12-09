import { TestBed } from '@angular/core/testing';

import { AsposeService } from './aspose.service';

describe('AsposeService', () => {
  let service: AsposeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsposeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
