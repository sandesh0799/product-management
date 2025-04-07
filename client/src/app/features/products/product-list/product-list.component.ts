import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, finalize, map } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { CategoryService } from '../../categories/services/category.service';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
    standalone: true,
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule]
})
export class ProductListComponent implements OnInit {
    filterForm!: FormGroup;
    products: Product[] = [];
    categories: any[] = [];
    loading: boolean = false;
    totalProducts: number = 0;
    currentPage: number = 1;
    itemsPerPage: number = 10;
    isAdmin$: Observable<Boolean>

    constructor(
        private fb: FormBuilder,
        private productService: ProductService,
        private categoryService: CategoryService,
        private toastService: ToastService,
        private authService: AuthService
    ) {
        this.isAdmin$ = this.authService.currentUser$.pipe(
            map(user => user?.role === 'admin')
        );
    }

    ngOnInit(): void {
        this.createForm();
        this.loadCategories();
        this.loadProducts();

        // Listen for form changes
        this.filterForm.valueChanges.pipe(debounceTime(500)).subscribe(() => {
            this.loadProducts();
        });
    }

    createForm(): void {
        this.filterForm = this.fb.group({
            search: [''],
            categoryId: [''],
            sortBy: ['name:asc']
        });
    }

    loadCategories(): void {
        this.categoryService.getCategories().subscribe({
            next: (categories) => {
                console.log(categories)
                this.categories = categories
            },
            error: (err) => this.toastService.showError('Failed to load categories')
        });
    }

    loadProducts(): void {
        const filterValues = this.filterForm.value;
        const { search, categoryId = '', sortBy } = filterValues;

        this.loading = true;
        this.productService.getProducts({
            search,
            categoryId,
            sortBy,
            page: this.currentPage,
            limit: this.itemsPerPage
        }).pipe(
            debounceTime(300),
            finalize(() => this.loading = false)
        ).subscribe({
            next: (response) => {
                this.products = response.products || [];
                this.totalProducts = response.total || 0;
            },
            error: (err) => {
                this.toastService.showError('Failed to load products');
            }
        });
    }

    resetFilters(): void {
        this.filterForm.reset();
        this.filterForm.patchValue({
            search: [''],
            categoryId: [''],
            sortBy: ['name:asc']
        })
        this.loadProducts();
    }

    deleteProduct(productId: number): void {
        if (confirm('Are you sure you want to delete this product?')) {
            this.productService.deleteProduct(productId).subscribe({
                next: () => {
                    this.toastService.showSuccess('Product deleted successfully');
                    this.loadProducts(); // Reload the list after deletion
                },
                error: (err) => {
                    this.toastService.showError('Failed to delete product');
                }
            });
        }
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.loadProducts();
    }
}
