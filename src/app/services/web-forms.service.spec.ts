import { TestBed } from '@angular/core/testing';

import { WebFormsService } from './web-forms.service';

describe('WebFormsService', () => {
  let service: WebFormsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebFormsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
