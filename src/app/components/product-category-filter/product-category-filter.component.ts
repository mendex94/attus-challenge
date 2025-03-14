import { Component, Output, EventEmitter, Input, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-product-category-filter',
  imports: [ReactiveFormsModule, SelectModule, FloatLabelModule],
  templateUrl: './product-category-filter.component.html',
})
export class ProductCategoryFilterComponent {
  @Input() categories: string[] = [];
  @Output() categoryChanged = new EventEmitter<string>();

  readonly fb = inject(NonNullableFormBuilder);

  form = this.fb.group<{
    category: string | undefined;
  }>({
    category: undefined,
  });

  constructor() {
    this.form.controls.category.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((category) => this.categoryChanged.emit(category));
  }
}
