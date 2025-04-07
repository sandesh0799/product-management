import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';

@Component({
    selector: 'app-loading-indicator',
    standalone: true,
    imports: [CommonModule],
    template: `
    @if (loadingService.loading$ | async) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p class="text-gray-700">Loading...</p>
        </div>
      </div>
    }
  `
})
export class LoadingIndicatorComponent {
    constructor(public loadingService: LoadingService) { }
}