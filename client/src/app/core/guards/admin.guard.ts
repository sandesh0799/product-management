import { inject } from '@angular/core';
import { Router, CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const adminGuard: CanMatchFn = (route, segments) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return authService.currentUser$.pipe(
        take(1),
        map(user => {
            // Check if user has admin role
            if (user && user.role === 'admin') {
                return true;
            }

            // Redirect to dashboard if not admin
            router.navigate(['/dashboard']);
            return false;
        })
    );
};