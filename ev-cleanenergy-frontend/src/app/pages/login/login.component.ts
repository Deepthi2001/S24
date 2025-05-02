import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

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
  errorMessage = '';
  loading = false;
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  
  constructor() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  
  submit() {
    if (this.form.valid) {
      const { username, password } = this.form.value;
      this.loading = true;
      this.errorMessage = '';
      
      this.authService.login(username, password).subscribe({
        next: () => {
          // Navigate to dashboard on successful login
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.message || 'Invalid credentials. Please use Saideepthi/Saideepthi.';
        }
      });
    }
  }
  

}