import {
  Component,
  inject,
  ChangeDetectionStrategy,
  signal,
  effect,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, lastValueFrom } from 'rxjs';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ProductsService } from './services/products.service';
import {
  injectQuery,
  keepPreviousData,
} from '@tanstack/angular-query-experimental';
import { Product } from './types/product';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProductsService],
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private productService = inject(ProductsService);
  readonly fb = inject(NonNullableFormBuilder);

  products = signal<Product[] | undefined>(undefined);
  categories = signal<string[]>([]);

  readonly form = this.fb.group({
    term: '',
    category: '',
  });

  readonly term = toSignal(
    this.form.controls.term.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ),
    {
      initialValue: '',
    }
  );

  readonly category = toSignal(
    this.form.controls.category.valueChanges.pipe(distinctUntilChanged()),
    {
      initialValue: '',
    }
  );

  readonly productsQuery = injectQuery(() => ({
    queryKey: ['products', this.term(), this.category()],
    queryFn: () => {
      return lastValueFrom(
        this.productService.filterProducts(this.term(), this.category())
      );
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  }));

  readonly categoriesQuery = injectQuery(() => ({
    queryKey: ['categories'],
    queryFn: () => {
      return lastValueFrom(this.productService.getCategories());
    },
  }));

  constructor() {
    effect(() => {
      this.products.set(this.productsQuery.data());
    });

    effect(() => {
      this.categories.set(this.categoriesQuery.data() || []);
    });
  }
}
