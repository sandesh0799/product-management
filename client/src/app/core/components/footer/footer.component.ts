import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    standalone: true,
    template: `
    <footer class="bg-gray-800 text-white py-8 mt-auto">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <p class="text-sm">&copy; {{ currentYear }} Admin Portal. All rights reserved.</p>
          </div>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-white">Privacy Policy</a>
            <a href="#" class="text-gray-400 hover:text-white">Terms of Service</a>
            <a href="#" class="text-gray-400 hover:text-white">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
    currentYear = new Date().getFullYear();
}
