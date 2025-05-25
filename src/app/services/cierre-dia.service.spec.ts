import { TestBed } from '@angular/core/testing';

import { CierreDiaService } from './cierre-dia.service';

describe('CierreDiaService', () => {
  let service: CierreDiaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CierreDiaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
