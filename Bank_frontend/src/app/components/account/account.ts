import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';
import { Customer } from '../../models/customer.model';
import { Transaction } from '../../models/transaction.model';
import { Account as AccountModel } from '../../models/account.model';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class Account implements OnInit {
  currentUser: Customer | null = null;
  account: AccountModel | null = null;
  transactions: Transaction[] = [];
  
  depositForm: FormGroup;
  withdrawForm: FormGroup;
  updateBalanceForm: FormGroup;
  interestForm: FormGroup;
  notificationForm: FormGroup;
  
  loading = false;
  transactionsLoading = false;
  accountLoading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  activeTab = 'transactions';
  isAdmin = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private authService: AuthService,
    private router: Router
  ) {
    this.depositForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]]
    });

    this.withdrawForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]]
    });

    this.updateBalanceForm = this.fb.group({
      newBalance: ['', [Validators.required, Validators.min(0)]]
    });

    this.interestForm = this.fb.group({
      rate: ['', [Validators.required, Validators.min(0.01)]],
      years: ['', [Validators.required, Validators.min(1)]]
    });

    this.notificationForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.authService.isAdmin();
    if (this.currentUser) {
      this.loadAccount();
      this.loadTransactions();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadAccount(): void {
    if (this.currentUser?.accountNo) {
      this.accountLoading = true;
      this.accountService.getAccount(this.currentUser.accountNo).subscribe({
        next: (account) => {
          this.account = account;
          this.accountLoading = false;
        },
        error: (error) => {
          this.showMessage('Error loading account details', 'error');
          this.accountLoading = false;
        }
      });
    }
  }

  loadTransactions(): void {
    if (this.currentUser?.accountNo) {
      this.transactionsLoading = true;
      this.accountService.getTransactionHistory(this.currentUser.accountNo).subscribe({
        next: (transactions) => {
          this.transactions = transactions.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          this.transactionsLoading = false;
        },
        error: (error) => {
          this.showMessage('Error loading transactions', 'error');
          this.transactionsLoading = false;
        }
      });
    }
  }

  onDeposit(): void {
    if (this.depositForm.valid && !this.loading && this.currentUser?.accountNo) {
      this.loading = true;
      const amount = this.depositForm.get('amount')?.value;

      this.accountService.deposit(this.currentUser.accountNo, amount).subscribe({
        next: (newBalance) => {
          this.depositForm.reset();
          this.showMessage(`Successfully deposited ₹${amount}`, 'success');
          this.loadAccount();
          this.loadTransactions();
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

      this.accountService.withdraw(this.currentUser.accountNo, amount).subscribe({
        next: (newBalance) => {
          this.withdrawForm.reset();
          this.showMessage(`Successfully withdrawn ₹${amount}`, 'success');
          this.loadAccount();
          this.loadTransactions();
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

  onUpdateBalance(): void {
    if (this.updateBalanceForm.valid && !this.loading && this.currentUser?.accountNo) {
      this.loading = true;
      const newBalance = this.updateBalanceForm.get('newBalance')?.value;

      this.accountService.updateBalance(this.currentUser.accountNo, newBalance).subscribe({
        next: (account) => {
          this.account = account;
          this.updateBalanceForm.reset();
          this.showMessage(`Balance updated to ₹${newBalance}`, 'success');
          this.loading = false;
        },
        error: (error) => {
          this.showMessage('Balance update failed. Please try again.', 'error');
          this.loading = false;
        }
      });
    }
  }

  onCalculateInterest(): void {
    if (this.interestForm.valid && !this.loading && this.currentUser?.accountNo) {
      this.loading = true;
      const rate = this.interestForm.get('rate')?.value;
      const years = this.interestForm.get('years')?.value;

      this.accountService.calculateInterest(this.currentUser.accountNo, rate, years).subscribe({
        next: (interest) => {
          this.showMessage(`Calculated Interest: ₹${interest.toFixed(2)} for ${years} year(s) at ${rate}% rate`, 'success');
          this.loading = false;
        },
        error: (error) => {
          this.showMessage('Interest calculation failed. Please try again.', 'error');
          this.loading = false;
        }
      });
    }
  }

  onSendNotification(): void {
    if (this.notificationForm.valid && !this.loading && this.currentUser?.accountNo) {
      this.loading = true;
      const message = this.notificationForm.get('message')?.value;

      this.accountService.sendNotification(this.currentUser.accountNo, message).subscribe({
        next: (response) => {
          this.notificationForm.reset();
          this.showMessage(response, 'success');
          this.loading = false;
        },
        error: (error) => {
          this.showMessage('Notification failed. Please try again.', 'error');
          this.loading = false;
        }
      });
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
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
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['min']) return `${fieldName} must be greater than ${field.errors['min'].min}`;
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}
