import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategoryFilterComponent } from './product-category-filter.component';

describe('ProductCategoryFilterComponent', () => {
  let component: ProductCategoryFilterComponent;
  let fixture: ComponentFixture<ProductCategoryFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCategoryFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCategoryFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
