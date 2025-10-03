import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { AuthService } from '../../services/auth.service';
import { Customer as CustomerModel } from '../../models/customer.model';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './customer.html',
  styleUrl: './customer.css'
})
export class Customer implements OnInit {
  currentUser: CustomerModel | null = null;
  balance: number = 0;
  depositForm: FormGroup;
  withdrawForm: FormGroup;
  loading = false;
  balanceLoading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private authService: AuthService,
    private router: Router
  ) {
    this.depositForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]]
    });

    this.withdrawForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.loadBalance();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadBalance(): void {
    if (this.currentUser?.accountNo) {
      this.balanceLoading = true;
      this.customerService.checkBalance(this.currentUser.accountNo).subscribe({
        next: (balance) => {
          this.balance = balance;
          this.balanceLoading = false;
        },
        error: (error) => {
          this.showMessage('Error loading balance', 'error');
          this.balanceLoading = false;
        }
      });
    }
  }

  onDeposit(): void {
    if (this.depositForm.valid && !this.loading && this.currentUser?.accountNo) {
      this.loading = true;
      const amount = this.depositForm.get('amount')?.value;

      this.customerService.deposit(this.currentUser.accountNo, amount).subscribe({
        next: (newBalance) => {
          this.balance = newBalance;
          this.depositForm.reset();
          this.showMessage(`Successfully deposited ₹${amount}`, 'success');
          this.loading = false;
        },
        error: (error) => {
          this.showMessage('Deposit failed. Please try again.', 'error');
          this.loading = false;
        }
      });
    }
  }

  onWithdraw(): void {
    if (this.withdrawForm.valid && !this.loading && this.currentUser?.accountNo) {
      this.loading = true;
      const amount = this.withdrawForm.get('amount')?.value;

      this.customerService.withdraw(this.currentUser.accountNo, amount).subscribe({
        next: (newBalance) => {
          this.balance = newBalance;
          this.withdrawForm.reset();
          this.showMessage(`Successfully withdrawn ₹${amount}`, 'success');
          this.loading = false;
        },
        error: (error) => {
          const errorMessage = error.error?.message || 'Withdrawal failed. Please try again.';
          this.showMessage(errorMessage, 'error');
          this.loading = false;
        }
      });
    }
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Amount is required';
      if (field.errors['min']) return 'Amount must be greater than 0';
    }
    return '';
  }
}
