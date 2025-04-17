import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService, Category } from '../../../services/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  isEditing = false;
  categoryId: string | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    this.isEditing = !!this.categoryId;

    if (this.isEditing && this.categoryId) {
      this.loadCategory(this.categoryId);
    }
  }

  loadCategory(id: string): void {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        const category = categories.find(c => c._id === id);
        if (category) {
          this.categoryForm.patchValue({
            name: category.name
          });
        } else {
          this.error = 'Category not found';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load category. Please try again later.';
        this.isLoading = false;
        console.error('Error loading category:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.isLoading = true;
      this.error = null;

      const categoryData: Category = {
        name: this.categoryForm.value.name
      };

      const operation = this.isEditing && this.categoryId
        ? this.categoryService.updateCategory(this.categoryId, categoryData)
        : this.categoryService.createCategory(categoryData);

      operation.subscribe({
        next: () => {
          this.router.navigate(['/categories']);
        },
        error: (err) => {
          this.error = this.isEditing
            ? 'Failed to update category. Please try again later.'
            : 'Failed to create category. Please try again later.';
          this.isLoading = false;
          console.error('Error saving category:', err);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/categories']);
  }
} 