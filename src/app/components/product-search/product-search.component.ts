import { Component, Output, EventEmitter, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-product-search',
  imports: [ReactiveFormsModule, InputTextModule, FloatLabelModule],
  templateUrl: './product-search.component.html',
})
export class ProductSearchComponent {
  @Output() searchTermChanged = new EventEmitter<string>();

  readonly fb = inject(NonNullableFormBuilder);

  form = this.fb.group({
    term: '',
  });

  constructor() {
    this.form.controls.term.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => this.searchTermChanged.emit(term));
  }
}
