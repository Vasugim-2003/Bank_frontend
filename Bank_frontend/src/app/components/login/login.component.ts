import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  returnUrl = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Get return URL from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.loading) {
      this.loading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;
      console.log('Attempting login with:', { email, password });

      this.customerService.login(email, password).subscribe({
        next: (customer) => {
          console.log('Login successful:', customer);
          this.authService.login(customer);
          this.loading = false;
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage = this.getErrorMessage(error);
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Invalid email format';
      if (field.errors['minlength']) return `Password must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }

  private getErrorMessage(error: any): string {
    // Check for specific error messages from backend
    if (error.error?.message) {
      return error.error.message;
    }
    
    // Handle HTTP status codes
    if (error.status) {
      switch (error.status) {
        case 400:
          return 'User does not exist or email/password mismatch';
        case 401:
          return 'Invalid email or password';
        case 404:
          return 'User not found';
        case 500:
          return 'Server error. Please try again later';
        default:
          return 'Login failed. Please check your credentials and try again';
      }
    }
    
    // Handle network or other errors
    if (error.message) {
      if (error.message.includes('Http failure')) {
        return 'User does not exist or email/password mismatch';
      }
      return error.message;
    }
    
    // Default fallback message
    return 'User does not exist or email/password mismatch';
  }
}