import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CustomerService } from './customer.service';
import { Customer } from '../models/customer.model';

describe('CustomerService', () => {
  let service: CustomerService;
  let httpMock: HttpTestingController;
  let mockCustomer: Customer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CustomerService]
    });
    
    service = TestBed.inject(CustomerService);
    httpMock = TestBed.inject(HttpTestingController);
    
    mockCustomer = {
      id: 1,
      customerId: 'CUST003',
      accountNo: '12387967890',
      name: 'Abi',
      address: '12th cross Main St',
      phone: 9876543876,
      email: 'abi123@example.com',
      password: 'secure123pPas',
      panNo: 'ABCDE1234F',
      accountType: 'Savings'
    };
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register', () => {
    it('should register a new customer', () => {
      service.register(mockCustomer).subscribe(customer => {
        expect(customer).toEqual(mockCustomer);
      });

      const req = httpMock.expectOne(`${service['baseUrl']}/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCustomer);
      req.flush(mockCustomer);
    });

    it('should handle registration error', () => {
      const errorResponse = { status: 400, statusText: 'Bad Request' };
      const errorMessage = 'Registration failed';

      service.register(mockCustomer).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${service['baseUrl']}/register`);
      req.flush(errorMessage, errorResponse);
    });
  });

  describe('login', () => {
    it('should login with email and password', () => {
      const email = 'abi123@example.com';
      const password = 'secure123pPas';

      service.login(email, password).subscribe(customer => {
        expect(customer).toEqual(mockCustomer);
      });

      const req = httpMock.expectOne(req => 
        req.url === `${service['baseUrl']}/login` && 
        req.method === 'POST' &&
        req.params.get('email') === email &&
        req.params.get('password') === password
      );
      
      req.flush(mockCustomer);
    });

    it('should handle login error', () => {
      const email = 'abi123@example.com';
      const password = 'wrongpassword';
      const errorResponse = { status: 401, statusText: 'Unauthorized' };

      service.login(email, password).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne(req => 
        req.url === `${service['baseUrl']}/login` && 
        req.method === 'POST'
      );
      
      req.flush('Invalid credentials', errorResponse);
    });
  });

  describe('checkBalance', () => {
    it('should check balance for account', () => {
      const accountNo = '12387967890';
      const balance = 1000.50;

      service.checkBalance(accountNo).subscribe(result => {
        expect(result).toBe(balance);
      });

      const req = httpMock.expectOne(`${service['baseUrl']}/balance/${accountNo}`);
      expect(req.request.method).toBe('GET');
      req.flush(balance);
    });
  });

  describe('deposit', () => {
    it('should deposit amount to account', () => {
      const accountNo = '12387967890';
      const amount = 500;
      const newBalance = 1500.50;

      service.deposit(accountNo, amount).subscribe(result => {
        expect(result).toBe(newBalance);
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
      const accountNo = '12387967890';
      const amount = 200;
      const newBalance = 800.50;

      service.withdraw(accountNo, amount).subscribe(result => {
        expect(result).toBe(newBalance);
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
      const accountNo = '12387967890';
      const amount = 2000;
      const errorResponse = { status: 400, statusText: 'Bad Request' };

      service.withdraw(accountNo, amount).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
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
});