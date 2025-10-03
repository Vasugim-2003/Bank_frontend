import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer, LoginRequest } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private baseUrl = 'http://localhost:8090/customer';

  constructor(private http: HttpClient) {}

  register(customer: Customer): Observable<Customer> {
    // This will create both customer and account in the backend
    return this.http.post<Customer>(`${this.baseUrl}/register`, customer);
  }

  // Admin methods to get all customers
  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.baseUrl}/all`);
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseUrl}/${customer.id}`, customer);
  }

  deleteCustomer(customerId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/customer/${customerId}`);
  }

  login(email: string, password: string): Observable<Customer> {
    const params = new HttpParams()
      .set('email', email)
      .set('password', password);
    return this.http.post<Customer>(`${this.baseUrl}/login`, null, { params });
  }



  checkBalance(accountNo: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/balance/${accountNo}`);
  }

  deposit(accountNo: string, amount: number): Observable<number> {
    const params = new HttpParams()
      .set('accountNo', accountNo)
      .set('amount', amount.toString());
    return this.http.post<number>(`${this.baseUrl}/deposit`, null, { params });
  }

  withdraw(accountNo: string, amount: number): Observable<number> {
    const params = new HttpParams()
      .set('accountNo', accountNo)
      .set('amount', amount.toString());
    return this.http.post<number>(`${this.baseUrl}/withdraw`, null, { params });
  }
}