import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AsposeService } from './aspose.service';

describe('AsposeService', () => {
  let service: AsposeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule],
    });
    service = TestBed.inject(AsposeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
