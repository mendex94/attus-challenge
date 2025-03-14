import { Observable } from 'rxjs';
import { Product } from '../types/product';

export interface IProductsService {
  getAllProducts(): Observable<Product[]>;
  getProductById(id: number): Observable<Product>;
  getCategories(): Observable<string[]>;
  addProduct(product: Omit<Product, 'id'>): Observable<Product>;
  updateProduct(product: Partial<Product>): Observable<Product>;
  deleteProduct(id: number): Observable<void>;
  filterProducts(name?: string, category?: string): Observable<Product[]>;
}
