import {
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FluidModule } from 'primeng/fluid';
import { Product } from '../../types/product';

@Component({
  selector: 'app-product-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    SelectModule,
    ButtonModule,
    CheckboxModule,
    FloatLabelModule,
    FluidModule,
  ],
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent {
  @Input()
  product?: Product;
  @Input()
  categories: string[] = [];
  @Input()
  submitLabel = 'Save';

  @Output()
  save = new EventEmitter<Omit<Product, 'id' | 'created_at'>>();
  @Output()
  cancel = new EventEmitter<void>();

  form: FormGroup;
  readonly fb = inject(NonNullableFormBuilder);

  constructor() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      category: ['', [Validators.required]],
      featured: [false],
    });

    effect(() => {
      if (this.product) {
        this.form.patchValue({
          name: this.product.name,
          description: this.product.description,
          price: this.product.price,
          category: this.product.category,
          featured: this.product.featured || false,
        });
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }
}
