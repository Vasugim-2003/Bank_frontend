export interface Account {
  id?: number;
  accountNo: string;
  balance: number;
  account_type: string;
}

export interface UpdateBalanceRequest {
  accountNo: string;
  newBalance: number;
}

export interface DepositWithdrawRequest {
  accountNo: string;
  amount: number;
}

export interface InterestCalculationRequest {
  accountNo: string;
  rate: number;
  years: number;
}

export interface NotificationRequest {
  accountNo: string;
  message: string;
}