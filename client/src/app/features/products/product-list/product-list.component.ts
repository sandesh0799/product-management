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
    totalPages: number = 1;
    isAdmin$: Observable<Boolean>

    // Bulk upload properties
    showBulkUploadModal = false;
    selectedFile: File | null = null;
    uploadProgress = 0;
    uploadError: string | null = null;
    isUploading = false;

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
                this.totalPages = Math.ceil(this.totalProducts / this.itemsPerPage);
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

    // Bulk upload methods
    openBulkUploadModal() {
        this.showBulkUploadModal = true;
        this.selectedFile = null;
        this.uploadProgress = 0;
        this.uploadError = null;
    }

    closeBulkUploadModal() {
        this.showBulkUploadModal = false;
        this.selectedFile = null;
        this.uploadProgress = 0;
        this.uploadError = null;
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            const fileType = file.name.split('.').pop()?.toLowerCase();
            
            if (fileType !== 'csv' && fileType !== 'xlsx') {
                this.uploadError = 'Please select a CSV or XLSX file';
                this.selectedFile = null;
                return;
            }
            
            this.selectedFile = file;
            this.uploadError = null;
        }
    }

    uploadFile() {
        if (!this.selectedFile) return;

        this.isUploading = true;
        this.uploadProgress = 0;
        this.uploadError = null;

        const formData = new FormData();
        formData.append('file', this.selectedFile);

        this.productService.bulkUploadProducts(formData).subscribe({
            next: (response) => {
                this.uploadProgress = 100;
                this.isUploading = false;
                this.closeBulkUploadModal();
                this.loadProducts(); // Refresh the product list
            },
            error: (error) => {
                this.uploadError = error.error?.message || 'Error uploading file';
                this.isUploading = false;
            }
        });
    }

    downloadReport(): void {
        this.productService.downloadReport().subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'products_report.xlsx';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                this.toastService.showSuccess('Report downloaded successfully');
            },
            error: (error) => {
                this.toastService.showError('Failed to download report');
            }
        });
    }

    getPageNumbers(): number[] {
        const pages: number[] = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    }

    getEndItemNumber(): number {
        return Math.min(this.currentPage * this.itemsPerPage, this.totalProducts);
    }
}
