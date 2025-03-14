import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';

import { Product } from '../../types/product';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-product',
  imports: [CommonModule, CardModule, ConfirmDialogModule, ButtonModule],
  providers: [ConfirmationService],
  templateUrl: './product.component.html',
})
export class ProductComponent {
  @Input()
  product!: Product;

  private router = inject(Router);

  navigateToEdit(): void {
    this.router.navigate(['/products/edit', this.product.id]);
  }
}
