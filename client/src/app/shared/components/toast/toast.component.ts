import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fixed top-4 right-4 z-50 space-y-2 w-80">
      @for (toast of toastService.toasts$ | async; track toast.id) {
        <div 
          class="rounded-lg p-4 shadow-lg flex items-start justify-between"
          [ngClass]="{
            'bg-green-100 text-green-800': toast.type === 'success',
            'bg-red-100 text-red-800': toast.type === 'error',
            'bg-blue-100 text-blue-800': toast.type === 'info',
            'bg-yellow-100 text-yellow-800': toast.type === 'warning'
          }"
        >
          <p>{{ toast.message }}</p>
          <button 
            (click)="toastService.remove(toast.id)" 
            class="ml-4 text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
    constructor(public toastService: ToastService) { }
}