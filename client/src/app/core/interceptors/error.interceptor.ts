import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const toastService = inject(ToastService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                // Auto logout if 401 response returned from API
                authService.logout();
                router.navigate(['/login']);
                toastService.showError('Your session has expired. Please log in again.');
            } else if (error.status === 403) {
                router.navigate(['/dashboard']);
                toastService.showError('You do not have permission to access this resource.');
            } else if (error.status === 500) {
                toastService.showError('Server error. Please try again later.');
            } else {
                // Display error message
                const message = error.error?.message || 'An unknown error occurred';
                toastService.showError(message);
            }

            return throwError(() => error);
        })
    );
};