import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoryService, Category } from '../../../services/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.error = null;
    
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        console.log(this.categories)
        this.categories = categories;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load categories. Please try again later.';
        this.isLoading = false;
        console.error('Error loading categories:', err);
      }
    });
  }

  navigateToCreate(): void {
    this.router.navigate(['categories', 'create']);
  }

  navigateToEdit(id: string): void {
    this.router.navigate(['categories', 'edit', id]);
  }

  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (err) => {
          this.error = 'Failed to delete category. Please try again later.';
          console.error('Error deleting category:', err);
        }
      });
    }
  }
} 