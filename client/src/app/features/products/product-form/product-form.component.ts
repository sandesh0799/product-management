import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../categories/services/category.service';
import { ProductService } from '../services/product.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {
  productForm: FormGroup;
  categories: any[] = [];  // Holds the list of categories
  isEditing = false;  // Flag to determine if we are editing an existing product
  productId: string | null = null;  // Holds the product ID for editing

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Initialize the form group
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      image: ['', [Validators.required, Validators.pattern(/https?:\/\/.*\.(jpg|jpeg|png|gif)/i)]],
      price: ['', [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],  // Adding category field
    });
  }

  ngOnInit(): void {
    // Fetch categories from the API when the component is initialized
    this.categoryService.getCategories().subscribe(
      (data) => {
        this.categories = data;  // Populate categories
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );

    // Check if we are editing a product (via route parameter)
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');  // Get product ID from the URL
      if (this.productId) {
        this.isEditing = true;
        this.loadProductData(this.productId);
      }
    });
  }

  // Load product data for editing
  loadProductData(productId: string) {
    this.productService.getProductById(productId).subscribe(
      (productData) => {
        this.productForm.patchValue({ ...productData, categoryId: this.categories.find((data) => data._id === productData?.category)?._id }); // Patch values to the form
      },
      (error) => {
        console.error('Error fetching product:', error);
      }
    );
  }

  submitForm() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;

      if (this.isEditing) {
        // If editing, update the product
        this.productService.updateProduct(this.productId!, productData).subscribe(
          (data) => {
            this.toastService.showSuccess('Product Updated Successfully!');
            this.router.navigate(['/products']);
          },
          (error) => {
            console.error('Error updating product:', error);
          }
        );
      } else {
        // Otherwise, create a new product
        this.productService.createProduct(productData).subscribe(
          (data) => {
            this.toastService.showSuccess('Product Added Successfully!');
            this.router.navigate(['/products']);
          },
          (error) => {
            console.error('Error adding product:', error);
          }
        );
      }
    } else {
      console.log('Form is invalid');
    }
  }
}
