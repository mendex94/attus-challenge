import { Component, Input } from '@angular/core';
import { Product } from '../../types/product';
import { ProductComponent } from '../product/product.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-product-list',
  imports: [ProductComponent, ProgressSpinnerModule],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent {
  @Input() products: Product[] = [];
  @Input() emptyMessage: string = 'No products available';
}
