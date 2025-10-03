import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../models/account.model';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUrl = 'http://localhost:8090/account';

  constructor(private http: HttpClient) {}

  addAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(`${this.baseUrl}/add`, account);
  }

  getAccount(accountNo: string): Observable<Account> {
    return this.http.get<Account>(`${this.baseUrl}/${accountNo}`);
  }

  updateBalance(accountNo: string, newBalance: number): Observable<Account> {
    const params = new HttpParams()
      .set('accountNo', accountNo)
      .set('newBalance', newBalance.toString());
    return this.http.put<Account>(`${this.baseUrl}/update`, null, { params });
  }

  getTransactionHistory(accountNo: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/transactions/${accountNo}`);
  }

  calculateInterest(accountNo: string, rate: number, years: number): Observable<number> {
    const params = new HttpParams()
      .set('accountNo', accountNo)
      .set('rate', rate.toString())
      .set('years', years.toString());
    return this.http.get<number>(`${this.baseUrl}/interest`, { params });
  }

  sendNotification(accountNo: string, message: string): Observable<string> {
    const params = new HttpParams()
      .set('accountNo', accountNo)
      .set('message', message);
    return this.http.post<string>(`${this.baseUrl}/notify`, null, { params });
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