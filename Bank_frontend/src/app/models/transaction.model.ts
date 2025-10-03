export interface Transaction {
  id?: number;
  accountNo: string;
  transaction_type: string;
  amount: number;
  timestamp: string;
}