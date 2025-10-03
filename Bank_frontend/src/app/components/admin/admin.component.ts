import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { AuthService } from '../../services/auth.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  selectedCustomer: Customer | null = null;
  
  customerForm: FormGroup;
  searchTerm = '';
  isLoading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  
  showForm = false;
  isEditMode = false;
  activeTab = 'customers';

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private authService: AuthService,
    private router: Router
  ) {
    this.customerForm = this.fb.group({
      id: [''],
      customerId: [''],
      accountNo: [''], 
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      panNo: ['', [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
      accountType: ['Savings', Validators.required]
    });
  }

  ngOnInit() {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/home']);
      return;
    }
    this.loadCustomers();
  }

  loadCustomers() {
    this.isLoading = true;
    this.customerService.getAllCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
        this.filteredCustomers = customers;
        this.isLoading = false;
        console.log('Loaded customers:', customers);
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.showMessage('Failed to load customers. The backend endpoint /customer/all might not be implemented yet.', 'error');
        this.isLoading = false;
        this.customers = [];
        this.filteredCustomers = [];
      }
    });
  }

  searchCustomers() {
    if (!this.searchTerm.trim()) {
      this.filteredCustomers = this.customers;
    } else {
      this.filteredCustomers = this.customers.filter(customer =>
        customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.customerId.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  showAddCustomerForm() {
    this.showForm = true;
    this.isEditMode = false;
    this.customerForm.reset();
    this.customerForm.patchValue({ accountType: 'Savings' });
    this.selectedCustomer = null;
  }

  editCustomer(customer: Customer) {
    this.selectedCustomer = customer;
    this.showForm = true;
    this.isEditMode = true;
    this.customerForm.patchValue(customer);
  }

  cancelForm() {
    this.showForm = false;
    this.isEditMode = false;
    this.selectedCustomer = null;
    this.customerForm.reset();
  }

  onSubmit() {
    console.log('Form submission attempted');
    console.log('Form valid:', this.customerForm.valid);
    console.log('Form value:', this.customerForm.value);
    console.log('Form errors:', this.getFormErrors());
    
    if (this.customerForm.valid) {
      const customerData = this.customerForm.value;
      
      if (this.isEditMode && this.selectedCustomer) {
        customerData.id = this.selectedCustomer.id;
        this.customerService.updateCustomer(customerData).subscribe({
          next: (response) => {
            this.showMessage('Customer updated successfully', 'success');
            this.loadCustomers();
            this.cancelForm();
          },
          error: (error) => {
            this.showMessage('Failed to update customer', 'error');
          }
        });
      } else {
        const processedCustomerData = {
          ...customerData,
          phone: parseInt(customerData.phone, 10),
          id: undefined, 
          customerId: this.generateCustomerId(),
          accountNo: this.generateAccountNumber()
        };
        
        console.log('Adding new customer with data:', processedCustomerData);
        
        this.customerService.register(processedCustomerData).subscribe({
          next: (response) => {
            console.log('Customer added successfully:', response);
            this.showMessage('Customer added successfully', 'success');
            this.loadCustomers();
            this.cancelForm();
          },
          error: (error) => {
            console.error('Error adding customer:', error);
            console.error('Error details:', error.error);
            console.error('Error message:', error.message);
            console.error('Error status:', error.status);
            
            let errorMessage = 'Failed to add customer: ';
            if (error.error) {
              if (typeof error.error === 'string') {
                errorMessage += error.error;
              } else if (error.error.message) {
                errorMessage += error.error.message;
              } else {
                errorMessage += JSON.stringify(error.error);
              }
            } else {
              errorMessage += error.message || 'Unknown error';
            }
            
            this.showMessage(errorMessage, 'error');
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  deleteCustomer(customer: Customer) {
    if (confirm(`Are you sure you want to delete customer ${customer.name}?`)) {
      this.customerService.deleteCustomer(customer.customerId).subscribe({
        next: (response) => {
          this.showMessage('Customer deleted successfully', 'success');
          this.loadCustomers();
        },
        error: (error) => {
          this.showMessage('Failed to delete customer', 'error');
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  showMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  // Analytics methods
  getTotalCustomers(): number {
    return this.customers.length;
  }

  getActiveCustomers(): number {
    return this.customers.filter(c => c.accountType !== 'Closed').length;
  }

  getSavingsAccounts(): number {
    return this.customers.filter(c => c.accountType === 'Savings').length;
  }

  getCurrentAccounts(): number {
    return this.customers.filter(c => c.accountType === 'Current').length;
  }

  getFieldError(fieldName: string): string {
    const field = this.customerForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Invalid email format';
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['pattern']) {
        if (fieldName === 'phone') return 'Phone must be 10 digits';
        if (fieldName === 'panNo') return 'PAN must be in format: ABCDE1234F';
      }
    }
    return '';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.customerForm.controls).forEach(key => {
      const control = this.customerForm.get(key);
      control?.markAsTouched();
    });
  }

  private getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.customerForm.controls).forEach(key => {
      const control = this.customerForm.get(key);
      if (control?.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  debugFormState() {
    console.log('=== FORM DEBUG INFO ===');
    console.log('Form valid:', this.customerForm.valid);
    console.log('Form invalid:', this.customerForm.invalid);
    console.log('Is loading:', this.isLoading);
    console.log('Button should be disabled:', this.customerForm.invalid || this.isLoading);
    console.log('Form value:', this.customerForm.value);
    console.log('Form errors:', this.getFormErrors());
    console.log('Is edit mode:', this.isEditMode);
    console.log('Selected customer:', this.selectedCustomer);
    
    // Check each field individually
    Object.keys(this.customerForm.controls).forEach(key => {
      const control = this.customerForm.get(key);
      console.log(`${key}:`, {
        value: control?.value,
        valid: control?.valid,
        errors: control?.errors,
        touched: control?.touched,
        dirty: control?.dirty
      });
    });
  }

  private generateCustomerId(): string {
    // Generate customer ID like CUST001, CUST002, etc.
    const timestamp = Date.now().toString().slice(-6);
    return `CUST${timestamp}`;
  }

  private generateAccountNumber(): string {
    // Generate account number like ACC123456789
    const timestamp = Date.now().toString().slice(-9);
    return `ACC${timestamp}`;
  }
}