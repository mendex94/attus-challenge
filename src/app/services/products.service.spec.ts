import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { ProductsService } from './products.service';
import { Product } from '../types/product';
import { provideHttpClient } from '@angular/common/http';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all products', () => {
    const dummyProducts: Product[] = [
      {
        id: 1,
        name: 'Test',
        description: 'Dummy description',
        price: 799.99,
        category: 'Eletronics',
        featured: true,
        created_at: '2025-03-12T12:00:00.000Z',
      },
    ];

    service.getAllProducts().subscribe((products) => {
      expect(products.length).toBe(1);
      expect(products).toEqual(dummyProducts);
    });

    const req = httpMock.expectOne('http://localhost:3000/products');
    expect(req.request.method).toBe('GET');
    req.flush(dummyProducts);
  });

  it('should retrieve a product by ID', () => {
    const dummyProduct: Product = {
      id: 1,
      name: 'Test',
      description: 'Dummy description',
      price: 799.99,
      category: 'Eletronics',
      featured: true,
      created_at: '2025-03-12T12:00:00.000Z',
    };

    service.getProductById(1).subscribe((product) => {
      expect(product).toEqual(dummyProduct);
    });

    const req = httpMock.expectOne('http://localhost:3000/products/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyProduct);
  });

  it('should update an existing product', () => {
    const updateProduct: Product = {
      id: 1,
      name: 'Updated Product',
      description: 'Updated description',
      price: 899.99,
      category: 'Eletronics',
      featured: true,
      created_at: '2025-03-12T12:00:00.000Z',
    };

    service.updateProduct(updateProduct).subscribe((product) => {
      expect(product).toEqual(updateProduct);
    });

    const req = httpMock.expectOne('http://localhost:3000/products/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updateProduct);
  });

  it('should delete a product', () => {
    service.deleteProduct(1).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:3000/products/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
