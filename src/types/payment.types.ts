export interface IWallet {
  id: string;
  businessId: string;
  balance: number;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ITransaction {
  id: string;
  businessId: string;
  walletId: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: string;
  status: string;
  reference?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface IPaymentRequest {
  amount: number;
  currency: string;
  businessId: string;
  metadata?: Record<string, any>;
}

export interface IBusinessCard {
  id: string;
  businessId: string;
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  created_at: string;
}

export interface IBusinessTopUp {
  id: string;
  businessId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  reference?: string;
  created_at: string;
}

export interface ITokenUsage {
  id: string;
  businessId: string;
  applicationId: string;
  tokens: number;
  type: string;
  created_at: string;
}
