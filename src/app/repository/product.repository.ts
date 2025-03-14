import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Product } from '../types/product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductRepository {
  private readonly API_URL = environment.API_URL;
  private http = inject(HttpClient);

  getAllProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  getProductById(id: number): Observable<Product> {
    const url = `${this.API_URL}/${id}`;

    return this.http.get<Product>(url).pipe(catchError(this.handleError));
  }

  getCategories(): Observable<string[]> {
    return this.getAllProducts()
      .pipe(
        map((products) => {
          const categories = products.map((product) => product.category);
          return [...new Set(categories)].filter(Boolean).sort();
        })
      )
      .pipe(catchError(this.handleError));
  }

  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http
      .post<Product>(this.API_URL, product)
      .pipe(catchError(this.handleError));
  }

  updateProduct(product: Partial<Product>): Observable<Product> {
    const url = `${this.API_URL}/${product.id}`;

    return this.http
      .put<Product>(url, product)
      .pipe(catchError(this.handleError));
  }

  deleteProduct(id: number): Observable<void> {
    const url = `${this.API_URL}/${id}`;

    return this.http.delete<void>(url).pipe(catchError(this.handleError));
  }

  filterProducts(name?: string, category?: string): Observable<Product[]> {
    let params = new HttpParams();

    if (name && name.trim()) {
      params = params.set('name_like', name);
    }

    if (category) {
      params = params.set('category_like', category);
    }

    return this.http
      .get<Product[]>(this.API_URL, { params })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
