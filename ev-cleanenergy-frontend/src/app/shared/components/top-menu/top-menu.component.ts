import { Component, inject, HostListener, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive]
})
export class TopMenuComponent {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  // isMenuOpen = false;
  
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.onResize();
    }
  }
  
  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId) && window.innerWidth > 768) {
      // this.isMenuOpen = false;
    }
  }
  
  logout() { 
    // this.isMenuOpen = false;
    // Clear login state from localStorage
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('isLoggedIn');
    }
    // Navigate to login page
    this.router.navigate(['/login']);
  }
}