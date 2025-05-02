import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class LoginComponent {
  form: FormGroup;
  hidePassword = true;
  private router = inject(Router);
  private fb = inject(FormBuilder);
  
  constructor() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  
  submit() {
    if (this.form.valid) {
      const { username, password } = this.form.value;
      
      // Check hardcoded credentials
      if (username === 'Saideepthi' && password === 'Saideepthi') {
        // Store login state in localStorage
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('isLoggedIn', 'true');
        }
        // Navigate to dashboard
        this.router.navigate(['/dashboard']);
      } else {
        // Handle invalid login
        alert('Invalid credentials. Please use Saideepthi/Saideepthi.');
      }
    }
  }
  
  // Helper method to check if we're in a browser environment
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }
}