export type User = {
  id: string;
  username: string;
  balance: number;
  transactions: Transaction[];
  holdings: Holding[];
};

export type Holding = {
  id: number;
  cryptoSymbol: string;
  quantity: number;
  pricePerUnit: number;
  totalCost: number;
};

export type Transaction = {
  id: number;
  userId: number;
  cryptoSymbol: string;
  transactionType: TransactionType;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  profitLoss: number;
  timestamp: number[];
};

export enum TransactionType {
  BUY = "BUY",
  SELL = "SELL",
}
