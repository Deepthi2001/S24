import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({ selector: 'app-login', templateUrl: './login.component.html' })
export class LoginComponent {
  form: FormGroup;
  constructor(fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  submit() {
    const { username, password } = this.form.value;
    this.auth.login(username, password).subscribe(() => this.router.navigate(['/dashboard']));
  }
}