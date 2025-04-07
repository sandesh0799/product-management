import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private toasts = new BehaviorSubject<Toast[]>([]);
    toasts$ = this.toasts.asObservable();
    private nextId = 0;

    showSuccess(message: string): void {
        this.show(message, 'success');
    }

    showError(message: string): void {
        this.show(message, 'error');
    }

    showInfo(message: string): void {
        this.show(message, 'info');
    }

    showWarning(message: string): void {
        this.show(message, 'warning');
    }

    private show(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
        const toast: Toast = {
            id: this.nextId++,
            message,
            type
        };

        const currentToasts = this.toasts.value;
        this.toasts.next([...currentToasts, toast]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            this.remove(toast.id);
        }, 5000);
    }

    remove(id: number): void {
        const currentToasts = this.toasts.value;
        this.toasts.next(currentToasts.filter(toast => toast.id !== id));
    }
}