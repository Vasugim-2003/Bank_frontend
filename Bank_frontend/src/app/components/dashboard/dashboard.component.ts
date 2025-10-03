import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentUser: Customer | null = null;
  balance: number = 0;
  loading = true;

  constructor(
    private authService: AuthService,
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.loadBalance();
    }
  }

  loadBalance(): void {
    if (this.currentUser?.accountNo) {
      this.customerService.checkBalance(this.currentUser.accountNo).subscribe({
        next: (balance) => {
          this.balance = balance;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading balance:', error);
          this.loading = false;
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  navigateToCustomer(): void {
    this.router.navigate(['/customer']);
  }

  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }
}