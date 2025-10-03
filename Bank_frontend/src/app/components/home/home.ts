import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  
  bankFeatures = [
    {
      icon: '🏦',
      title: 'Secure Banking',
      description: 'Advanced security features to protect your financial data'
    },
    {
      icon: '💳',
      title: 'Easy Transactions',
      description: 'Quick and seamless money transfers and payments'
    },
    {
      icon: '📊',
      title: 'Account Management',
      description: 'Complete control over your accounts and finances'
    },
    {
      icon: '📱',
      title: '24/7 Access',
      description: 'Access your account anytime, anywhere'
    },
    {
      icon: '🔒',
      title: 'Privacy Protection',
      description: 'Your financial information is always safe with us'
    },
    {
      icon: '💰',
      title: 'Competitive Rates',
      description: 'Best interest rates and minimal fees'
    }
  ];

  constructor(private router: Router) {}

  navigateToCustomerLogin() {
    this.router.navigate(['/login']);
  }

  navigateToAdminLogin() {
    this.router.navigate(['/admin-login']);
  }
}

