import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../types/product';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private API_URL = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API_URL);
  }

  getProductById(id: number): Observable<Product> {
    const url = `${this.API_URL}/${id}`;

    return this.http.get<Product>(url);
  }

  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.API_URL, product);
  }

  updatedProduct(product: Partial<Product>): Observable<Product> {
    const url = `${this.API_URL}/${product.id}`;

    return this.http.put<Product>(url, product);
  }

  deleteProduct(id: number): Observable<void> {
    const url = `${this.API_URL}/${id}`;

    return this.http.delete<void>(url);
  }

  filterProducts(name?: string, category?: string): Observable<Product[]> {
    let params = new HttpParams();
    if (name) {
      params = params.set('name_like', name);
    }

    if (category) {
      params = params.set('category_like', category);
    }

    return this.http.get<Product[]>(this.API_URL, { params });
  }
}
