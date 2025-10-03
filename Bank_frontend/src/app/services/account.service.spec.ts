import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AccountService } from './account.service';
import { Account } from '../models/account.model';
import { Transaction } from '../models/transaction.model';

describe('AccountService', () => {
  let service: AccountService;
  let httpMock: HttpTestingController;
  let mockAccount: Account;
  let mockTransaction: Transaction;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AccountService]
    });
    
    service = TestBed.inject(AccountService);
    httpMock = TestBed.inject(HttpTestingController);
    
    mockAccount = {
      id: 1,
      accountNo: 'ACC456',
      account_type: 'Savings',
      balance: 1000.50
    };

    mockTransaction = {
      id: 1,
      accountNo: 'ACC456',
      transaction_type: 'Deposit',
      amount: 500,
      timestamp: '2024-01-01T10:00:00'
    };
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addAccount', () => {
    it('should add a new account', () => {
      service.addAccount(mockAccount).subscribe((account: Account) => {
        expect(account).toEqual(mockAccount);
      });

      const req = httpMock.expectOne(`${service['baseUrl']}/add`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockAccount);
      req.flush(mockAccount);
    });

    it('should handle account creation error', () => {
      const errorResponse = { status: 400, statusText: 'Bad Request' };

      service.addAccount(mockAccount).subscribe({
        next: () => fail('Should have failed'),
        error: (error: any) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${service['baseUrl']}/add`);
      req.flush('Account creation failed', errorResponse);
    });
  });

  describe('getAccount', () => {
    it('should get account by account number', () => {
      const accountNo = 'ACC456';

      service.getAccount(accountNo).subscribe((account: Account) => {
        expect(account).toEqual(mockAccount);
      });

      const req = httpMock.expectOne(`${service['baseUrl']}/${accountNo}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockAccount);
    });

    it('should handle account not found error', () => {
      const accountNo = 'INVALID';
      const errorResponse = { status: 404, statusText: 'Not Found' };

      service.getAccount(accountNo).subscribe({
        next: () => fail('Should have failed'),
        error: (error: any) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${service['baseUrl']}/${accountNo}`);
      req.flush('Account not found', errorResponse);
    });
  });

  describe('getTransactionHistory', () => {
    it('should get transaction history for account', () => {
      const accountNo = 'ACC456';
      const mockTransactions = [mockTransaction];

      service.getTransactionHistory(accountNo).subscribe((transactions: Transaction[]) => {
        expect(transactions).toEqual(mockTransactions);
        expect(transactions.length).toBe(1);
      });

      const req = httpMock.expectOne(`${service['baseUrl']}/transactions/${accountNo}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTransactions);
    });

    it('should return empty array for account with no transactions', () => {
      const accountNo = 'ACC456';

      service.getTransactionHistory(accountNo).subscribe((transactions: Transaction[]) => {
        expect(transactions).toEqual([]);
        expect(transactions.length).toBe(0);
      });

      const req = httpMock.expectOne(`${service['baseUrl']}/transactions/${accountNo}`);
      req.flush([]);
    });

    it('should handle transaction history error', () => {
      const accountNo = 'INVALID';
      const errorResponse = { status: 404, statusText: 'Not Found' };

      service.getTransactionHistory(accountNo).subscribe({
        next: () => fail('Should have failed'),
        error: (error: any) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${service['baseUrl']}/transactions/${accountNo}`);
      req.flush('Account not found', errorResponse);
    });
  });

  describe('updateBalance', () => {
    it('should update account balance', () => {
      const accountNo = 'ACC456';
      const newBalance = 1500.50;
      const updatedAccount = { ...mockAccount, balance: newBalance };

      service.updateBalance(accountNo, newBalance).subscribe((account: Account) => {
        expect(account).toEqual(updatedAccount);
        expect(account.balance).toBe(newBalance);
      });

      const req = httpMock.expectOne(req => 
        req.url === `${service['baseUrl']}/update` && 
        req.method === 'PUT' &&
        req.params.get('accountNo') === accountNo &&
        req.params.get('newBalance') === newBalance.toString()
      );
      
      req.flush(updatedAccount);
    });

    it('should handle balance update error', () => {
      const accountNo = 'INVALID';
      const balance = 1000;
      const errorResponse = { status: 404, statusText: 'Not Found' };

      service.updateBalance(accountNo, balance).subscribe({
        next: () => fail('Should have failed'),
        error: (error: any) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(req => 
        req.url === `${service['baseUrl']}/update` && 
        req.method === 'PUT'
      );
      
      req.flush('Account not found', errorResponse);
    });
  });

  describe('deposit', () => {
    it('should deposit amount to account', () => {
      const accountNo = 'ACC456';
      const amount = 500;
      const newBalance = 1500.50;

      service.deposit(accountNo, amount).subscribe((balance: number) => {
        expect(balance).toBe(newBalance);
      });

      const req = httpMock.expectOne(req => 
        req.url === `${service['baseUrl']}/deposit` && 
        req.method === 'POST' &&
        req.params.get('accountNo') === accountNo &&
        req.params.get('amount') === amount.toString()
      );
      
      req.flush(newBalance);
    });
  });

  describe('withdraw', () => {
    it('should withdraw amount from account', () => {
      const accountNo = 'ACC456';
      const amount = 200;
      const newBalance = 800.50;

      service.withdraw(accountNo, amount).subscribe((balance: number) => {
        expect(balance).toBe(newBalance);
      });

      const req = httpMock.expectOne(req => 
        req.url === `${service['baseUrl']}/withdraw` && 
        req.method === 'POST' &&
        req.params.get('accountNo') === accountNo &&
        req.params.get('amount') === amount.toString()
      );
      
      req.flush(newBalance);
    });

    it('should handle insufficient balance error', () => {
      const accountNo = 'ACC456';
      const amount = 2000;
      const errorResponse = { status: 400, statusText: 'Bad Request' };

      service.withdraw(accountNo, amount).subscribe({
        next: () => fail('Should have failed'),
        error: (error: any) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(req => 
        req.url === `${service['baseUrl']}/withdraw` && 
        req.method === 'POST'
      );
      
      req.flush('Insufficient balance', errorResponse);
    });
  });

  describe('calculateInterest', () => {
    it('should calculate interest for account', () => {
      const accountNo = 'ACC456';
      const rate = 5.5;
      const years = 2;
      const expectedInterest = 110.05;

      service.calculateInterest(accountNo, rate, years).subscribe((interest: number) => {
        expect(interest).toBe(expectedInterest);
      });

      const req = httpMock.expectOne(req => 
        req.url === `${service['baseUrl']}/interest` && 
        req.method === 'GET' &&
        req.params.get('accountNo') === accountNo &&
        req.params.get('rate') === rate.toString() &&
        req.params.get('years') === years.toString()
      );
      
      req.flush(expectedInterest);
    });
  });

  describe('sendNotification', () => {
    it('should send notification for account', () => {
      const accountNo = 'ACC456';
      const message = 'Your balance has been updated';
      const response = 'Notification sent successfully';

      service.sendNotification(accountNo, message).subscribe((result: string) => {
        expect(result).toBe(response);
      });

      const req = httpMock.expectOne(req => 
        req.url === `${service['baseUrl']}/notify` && 
        req.method === 'POST' &&
        req.params.get('accountNo') === accountNo &&
        req.params.get('message') === message
      );
      
      req.flush(response);
    });
  });
});