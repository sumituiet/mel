import { TestBed } from '@angular/core/testing';

import { FaceMlServiceService } from './face-ml-service.service';

describe('FaceMlServiceService', () => {
  let service: FaceMlServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FaceMlServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
