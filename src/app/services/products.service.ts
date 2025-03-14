import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Product } from '../types/product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API_URL).pipe(
      catchError((error) => {
        console.error('Error fetching products: ', error);
        return throwError(() => new Error('Failed to fetch products'));
      })
    );
  }

  getProductById(id: number): Observable<Product> {
    const url = `${this.API_URL}/${id}`;

    return this.http.get<Product>(url).pipe(
      catchError((error) => {
        console.error('Error fetching product: ', error);
        return throwError(() => new Error('Failed to fetch product'));
      })
    );
  }

  getCategories(): Observable<string[]> {
    return this.getAllProducts()
      .pipe(
        map((products) => {
          const categories = products.map((product) => product.category);
          return [...new Set(categories)].filter(Boolean).sort();
        })
      )
      .pipe(
        catchError((error) => {
          console.error('Error fetching categories: ', error);
          return throwError(() => new Error('Failed to fetch categories'));
        })
      );
  }

  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.API_URL, product).pipe(
      catchError((error) => {
        console.error('Error adding product: ', error);
        return throwError(() => new Error('Failed to adding product'));
      })
    );
  }

  updateProduct(product: Partial<Product>): Observable<Product> {
    const url = `${this.API_URL}/${product.id}`;

    return this.http.put<Product>(url, product).pipe(
      catchError((error) => {
        console.error('Error updating product: ', error);
        return throwError(() => new Error('Failed to updating product'));
      })
    );
  }

  deleteProduct(id: number): Observable<void> {
    const url = `${this.API_URL}/${id}`;

    return this.http.delete<void>(url).pipe(
      catchError((error) => {
        console.error('Error deleting product: ', error);
        return throwError(() => new Error('Failed to deleting product'));
      })
    );
  }

  filterProducts(name?: string, category?: string): Observable<Product[]> {
    let params = new HttpParams();

    if (name && name.trim()) {
      params = params.set('name_like', name);
    }

    if (category) {
      params = params.set('category_like', category);
    }

    return this.http.get<Product[]>(this.API_URL, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching products: ', error);
        return throwError(() => new Error('Failed to fetch products'));
      })
    );
  }
}
