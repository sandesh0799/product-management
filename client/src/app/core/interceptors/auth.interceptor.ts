import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const authService = inject(AuthService);

    // Skip authentication for login and register endpoints
    if (request.url.includes('/login') || request.url.includes('/register')) {
        return next(request);
    }

    const token = authService.getToken();

    // Check if token exists
    if (!token) {
        return next(request);
    }

    // Check if token is expired, refresh if needed
    if (authService.isTokenExpired()) {
        return authService.refreshToken().pipe(
            take(1),
            switchMap(newToken => {
                if (newToken) {
                    return next(addTokenToRequest(request, newToken));
                }
                return next(request);
            })
        );
    }

    // Add token to request
    return next(addTokenToRequest(request, token));
};

function addTokenToRequest(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    });
}