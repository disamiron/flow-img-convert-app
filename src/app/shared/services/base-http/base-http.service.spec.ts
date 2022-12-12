import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { BaseHttpService } from './base-http.service';

describe('BaseHttpService', () => {
  let service: BaseHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule],
    });
    service = TestBed.inject(BaseHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
