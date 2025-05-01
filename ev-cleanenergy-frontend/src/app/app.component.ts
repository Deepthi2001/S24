import { Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf, isPlatformBrowser } from '@angular/common';
import { TopMenuComponent } from './shared/components/top-menu/top-menu.component';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet, TopMenuComponent, NgIf],
  templateUrl: `./app.component.html`,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ev-cleanenergy-frontend';
  private platformId = inject(PLATFORM_ID);

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('isLoggedIn') === 'true';
    }
    return false;
  }
}
