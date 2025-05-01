import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const AuthGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  
  // Check if user is logged in
  const isLoggedIn = isPlatformBrowser(platformId) ? 
    localStorage.getItem('isLoggedIn') === 'true' : false;
  
  if (!isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};