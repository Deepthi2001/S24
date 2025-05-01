import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({ selector: 'app-top-menu', templateUrl: './top-menu.component.html' })
export class TopMenuComponent {
  constructor(private auth: AuthService) {}
  logout() { this.auth.logout(); }
}