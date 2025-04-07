import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="flex justify-center items-center min-h-screen bg-gray-100">
      <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h1>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
          
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
            <div *ngIf="form.email.invalid && (form.email.dirty || form.email.touched)" class="mt-1 text-sm text-red-600">
              <p *ngIf="form.email.errors?.['required']">Email is required</p>
              <p *ngIf="form.email.errors?.['email']">Please enter a valid email</p>
            </div>
          </div>
          
          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
            <div *ngIf="form.password.invalid && (form.password.dirty || form.password.touched)" class="mt-1 text-sm text-red-600">
              <p *ngIf="form.password.errors?.['required']">Password is required</p>
              <p *ngIf="form.password.errors?.['minlength']">Password must be at least 6 characters</p>
            </div>
          </div>
          

          <!-- Submit Button -->
          <div>
            <button 
              type="submit" 
              [disabled]="registerForm.invalid || isLoading"
              class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
            >
              <span *ngIf="isLoading">Creating Account...</span>
              <span *ngIf="!isLoading">Register</span>
            </button>
          </div>
        </form>
        
        <!-- Login Link -->
        <div class="mt-4 text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <a routerLink="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get form() {
    return {
      email: this.registerForm.get('email')!,
      password: this.registerForm.get('password')!,
    };
  }


  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    const { email, password } = this.registerForm.value;

    this.authService.register({ email, password }).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastService.showSuccess('Registration successful');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isLoading = false;
        // Error is handled by error interceptor
      }
    });
  }
}
