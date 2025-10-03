import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.css']
})
export class AdminLoginComponent {
  adminLoginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.adminLoginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.adminLoginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const { username, password } = this.adminLoginForm.value;
      
      // Check for admin credentials
      if (username === 'admin' && password === 'admin2003') {
        // Create admin user object
        const adminUser = {
          customerId: 'ADMIN001',
          accountNo: 'ADMIN001',
          name: 'System Administrator',
          address: 'Admin Office',
          phone: 1800000000,
          email: 'admin@securebank.com',
          password: 'admin2003',
          panNo: 'ADMIN123456',
          role: 'admin'
        };
        

        this.authService.login(adminUser);
        
        
        this.router.navigate(['/admin']);
        
      } else {
        this.errorMessage = 'Invalid admin credentials. Please try again.';
      }
      
      this.isLoading = false;
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  get username() { return this.adminLoginForm.get('username'); }
  get password() { return this.adminLoginForm.get('password'); }
}

