export interface Customer {
  id?: number;
  customerId: string;
  accountNo: string;
  name: string;
  address: string;
  phone: number;
  email: string;
  password: string;
  panNo: string;
  accountType?: string;
  role?: string; 
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  customer: Customer;
  message?: string;
}