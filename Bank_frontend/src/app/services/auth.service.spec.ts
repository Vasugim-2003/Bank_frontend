import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Customer } from '../models/customer.model';

describe('AuthService', () => {
  let service: AuthService;
  let mockCustomer: Customer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    
    mockCustomer = {
      id: 1,
      customerId: 'CUST123',
      accountNo: 'ACC456',
      name: 'John Doe',
      address: '123 Main St',
      phone: 9876543210,
      email: 'john@example.com',
      password: 'password123',
      panNo: 'ABCDE1234F'
    };
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should store user in localStorage and update current user', () => {
      service.login(mockCustomer);

      expect(localStorage.getItem('currentUser')).toBe(JSON.stringify(mockCustomer));
      expect(service.getCurrentUser()).toEqual(mockCustomer);
      expect(service.isLoggedIn()).toBe(true);
    });

    it('should emit current user through observable', (done) => {
      service.currentUser$.subscribe(user => {
        if (user) {
          expect(user).toEqual(mockCustomer);
          done();
        }
      });

      service.login(mockCustomer);
    });
  });

  describe('logout', () => {
    it('should remove user from localStorage and clear current user', () => {
      service.login(mockCustomer);
      expect(service.isLoggedIn()).toBe(true);

      service.logout();

      expect(localStorage.getItem('currentUser')).toBeNull();
      expect(service.getCurrentUser()).toBeNull();
      expect(service.isLoggedIn()).toBe(false);
    });

    it('should emit null through observable after logout', (done) => {
      service.login(mockCustomer);
      
      let emissionCount = 0;
      service.currentUser$.subscribe(user => {
        emissionCount++;
        if (emissionCount === 2) { 
          expect(user).toBeNull();
          done();
        }
      });

      service.logout();
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no user is logged in', () => {
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should return current user when logged in', () => {
      service.login(mockCustomer);
      expect(service.getCurrentUser()).toEqual(mockCustomer);
    });
  });

  describe('isLoggedIn', () => {
    it('should return false when no user is logged in', () => {
      expect(service.isLoggedIn()).toBe(false);
    });

    it('should return true when user is logged in', () => {
      service.login(mockCustomer);
      expect(service.isLoggedIn()).toBe(true);
    });
  });

  describe('getAccountNo', () => {
    it('should return null when no user is logged in', () => {
      expect(service.getAccountNo()).toBeNull();
    });

    it('should return account number when user is logged in', () => {
      service.login(mockCustomer);
      expect(service.getAccountNo()).toBe('ACC456');
    });
  });

  describe('localStorage persistence', () => {
    it('should restore user from localStorage on service initialization', () => {
      localStorage.setItem('currentUser', JSON.stringify(mockCustomer));
      
      const newService = new AuthService();
      
      expect(newService.getCurrentUser()).toEqual(mockCustomer);
      expect(newService.isLoggedIn()).toBe(true);
    });

    it('should handle invalid JSON in localStorage gracefully', () => {
      localStorage.setItem('currentUser', 'invalid-json');
      
      expect(() => {
        const newService = new AuthService();
      }).not.toThrow();
    });
  });
});