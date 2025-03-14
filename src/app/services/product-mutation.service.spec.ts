import { TestBed } from '@angular/core/testing';

import { ProductMutationService } from './product-mutation.service';

describe('ProductMutationService', () => {
  let service: ProductMutationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductMutationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
