import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, catchError } from 'rxjs/operators';
import { LoadingService } from '../../shared/services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const loadingService = inject(LoadingService);

    // Show the loading indicator when the request is sent
    loadingService.show();
    // Pass the request to the next handler
    return next(request).pipe(
        finalize(() => {
            // Hide the loading indicator when the request completes (either success or error)
            loadingService.hide();

        }),
        catchError(error => {
            // Hide loading indicator on error as well
            loadingService.hide();
            throw error;
        })
    );
};
