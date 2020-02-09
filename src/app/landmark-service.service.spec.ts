import { TestBed } from '@angular/core/testing';

import { LandmarkServiceService } from './landmark-service.service';

describe('LandmarkServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LandmarkServiceService = TestBed.get(LandmarkServiceService);
    expect(service).toBeTruthy();
  });
});
