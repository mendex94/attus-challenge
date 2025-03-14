import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/products-page/products-page.component').then(
        (m) => m.ProductsPageComponent
      ),
  },
  {
    path: 'products/create',
    loadComponent: () =>
      import('./pages/product-create/product-create.component').then(
        (m) => m.ProductCreateComponent
      ),
  },
  {
    path: 'products/edit/:id',
    loadComponent: () =>
      import('./pages/product-update/product-update.component').then(
        (m) => m.ProductUpdateComponent
      ),
  },
];
