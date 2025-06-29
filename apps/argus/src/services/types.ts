export interface Service {
  name: string;
  addresses: string[];
}

export interface Transaction {
  time: string;
  type: string;
  sender: string;
  receiver?: string;
  amount?: {
    currency: string;
    issuer: string;
    value: string;
  };
  hash: string;
}

export interface TransactionAnalysis {
  startTime: string;
  endTime: string;
  totalTransactions: number;
  uawCount: number;
  transactions: Transaction[];
}

export interface UAWAnalysis {
  startTime: string;
  endTime: string;
  totalTransactions: number;
  uawCount: number;
  uniqueWallets: string[];
} 