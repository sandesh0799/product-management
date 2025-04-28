import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-indigo-600 text-white shadow-md">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center py-4">
          <!-- Logo -->
          <a routerLink="/" class="text-xl font-bold">Product Management</a>
          
          <!-- Navigation Links -->
          @if (isLoggedIn$ | async) {
            <div class="flex items-center space-x-6">
              <a routerLink="/dashboard" routerLinkActive="font-bold" class="hover:text-indigo-200">Dashboard</a>
              <a routerLink="/products" routerLinkActive="font-bold" class="hover:text-indigo-200">Products</a>
              <a routerLink="/categories" routerLinkActive="font-bold" class="hover:text-indigo-200">Categories</a>
              <!-- User Menu -->
              <div class="relative group">
                <button class="flex items-center space-x-1">
                  <span class="inline-block border border-gray-300 rounded-full h-10 w-10 flex items-center justify-center text-center">
                    {{ (currentUser$ | async)?.email?.slice(0, 1)?.toLocaleUpperCase() }}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <!-- Dropdown menu -->
                <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block group-focus-within:block group-hover:visible group-focus-within:visible">
                  <a class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100" (click)="logout()">Sign out</a>
                </div>
              </div>
            </div>
          } @else {
            <div class="space-x-4">
              <a routerLink="/login" class="hover:text-indigo-200">Login</a>
              <a routerLink="/register" class="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100">Register</a>
            </div>
          }
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  isLoggedIn$: Observable<Boolean>
  currentUser$: Observable<any>

  constructor(private authService: AuthService) {
    this.isLoggedIn$ = this.authService.isAuthenticated$;
    this.currentUser$ = this.authService.currentUser$;
  }

  logout(): void {
    this.authService.logout();
  }
}