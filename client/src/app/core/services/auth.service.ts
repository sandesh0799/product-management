import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API_URL = `${environment.apiUrl}/users`;
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    currentUser$ = this.currentUserSubject.asObservable();
    isAuthenticated$ = this.currentUser$.pipe(map(user => !!user));
    redirectUrl: string | null = null;

    constructor(private http: HttpClient) {
        this.loadUserFromStorage();
    }

    private loadUserFromStorage(): void {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            try {
                const user = JSON.parse(userJson);
                this.currentUserSubject.next(user);
            } catch (e) {
                localStorage.removeItem('currentUser');
            }
        }
    }

    login(email: string, password: string): Observable<any> {
        return this.http.post<{ user: User, token: string }>(`${this.API_URL}/login`, { email, password })
            .pipe(
                tap(response => {
                    this.setSession(response.user, response.token);
                })
            );
    }

    register(userData: Partial<any>): Observable<any> {
        return this.http.post<{ user: User, token: string }>(`${this.API_URL}/register`, userData)
            .pipe(
                tap(response => {
                    this.setSession(response.user, response.token);
                })
            );
    }

    logout(): void {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        localStorage.removeItem('expiresAt');
        this.currentUserSubject.next(null);
    }

    refreshToken(): Observable<string> {
        return this.http.post<{ token: string }>(`${this.API_URL}/refresh-token`, {})
            .pipe(
                tap(response => {
                    localStorage.setItem('token', response.token);
                    // Update expiration time
                    const expiresAt = new Date();
                    expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24h
                    localStorage.setItem('expiresAt', expiresAt.toISOString());
                }),
                map(response => response.token),
                catchError(error => {
                    this.logout();
                    return of('');
                })
            );
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isTokenExpired(): boolean {
        const expiresAtStr = localStorage.getItem('expiresAt');
        if (!expiresAtStr) return true;

        const expiresAt = new Date(expiresAtStr);
        return expiresAt < new Date();
    }

    private setSession(user: User, token: string): void {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('token', token);

        // Set token expiration (24 hours)
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        localStorage.setItem('expiresAt', expiresAt.toISOString());

        this.currentUserSubject.next(user);
    }
}