import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../products/services/product.service';
import { CategoryService } from '../categories/services/category.service';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError, concatMap } from 'rxjs/operators';

interface DashboardSummary {
  productCount: number;
  categoryCount: number;
  recentProducts: any[];
  userRole: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="py-6">
      <h1 class="text-3xl font-bold mb-6">Dashboard</h1>

      <ng-container *ngIf="dashboardData$ | async as data">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <!-- Stats Card -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-700">Products</h2>
            <p class="text-3xl font-bold text-indigo-600 mt-2">{{ data.productCount }}</p>
            <a routerLink="/products" class="text-sm text-indigo-500 mt-4 inline-block">View all products →</a>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-700">Categories</h2>
            <p class="text-3xl font-bold text-indigo-600 mt-2">{{ data.categoryCount }}</p>
            <a routerLink="/categories" class="text-sm text-indigo-500 mt-4 inline-block">View all categories →</a>
          </div>

        </div>

        <!-- Recent Products -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-700">Recent Products</h2>
          </div>

          <ng-container *ngIf="data.recentProducts && data.recentProducts.length > 0; else noRecentProducts">
            <div class="divide-y divide-gray-200">
              <div *ngFor="let product of data.recentProducts" class="px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 class="font-medium">{{ product.name }}</h3>
                  <p class="text-sm text-gray-500">{{ product.category?.name || 'No Category' }}</p>
                </div>
              </div>
            </div>
          </ng-container>

          <ng-template #noRecentProducts>
            <p class="p-6 text-gray-500">No recent products found.</p>
          </ng-template>
        </div>
      </ng-container>

      <ng-container *ngIf="!(dashboardData$ | async)">
        <div class="flex justify-center items-center h-64">
          <p>No Data found!</p>
        </div>
      </ng-container>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  dashboardData$!: Observable<DashboardSummary>;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    @Inject(CategoryService) private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.dashboardData$ = this.getUserData().pipe(
      concatMap(user =>
        this.getProductData().pipe(
          concatMap(productData =>
            this.getCategoryCount().pipe(
              map(categoryCount => ({
                productCount: productData.total,
                categoryCount,
                recentProducts: productData.products,
                userRole: user?.role || 'user'
              }))
            )
          )
        )
      )
    );

  }

  private getUserData(): Observable<any> {
    return this.authService.currentUser$.pipe(
      catchError(() => of({ role: 'user' }))
    );
  }

  private getProductData(): Observable<any> {
    return this.productService.getProducts({ limit: 5, sort: 'createdAt:desc' }).pipe(
      catchError(() => of({ products: [], total: 0 }))
    );
  }

  private getCategoryCount(): Observable<number> {
    return this.categoryService.getCategories().pipe(
      map(result => result.length),
      catchError(() => of(0))
    );
  }
}
