import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './core/components/footer/footer.component';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { LoadingIndicatorComponent } from './shared/components/loading-indicator/loading-indicator.component';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    LoadingIndicatorComponent,
    ToastComponent,
  ],
  template: `
    <app-navbar></app-navbar>
    <main class="container mx-auto p-4">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
    <app-loading-indicator></app-loading-indicator>
    <app-toast></app-toast>
  `
})
export class AppComponent {
}
