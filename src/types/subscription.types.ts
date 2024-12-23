export interface ISubscription {
  id: string;
  businessId: string;
  planId: string;
  status: string;
  startDate: string;
  endDate?: string;
  trialEndsAt?: string;
  canceledAt?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  created_at: string;
  updated_at: string;
}

export interface ISubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  limits: {
    agents?: number;
    conversations?: number;
    tokens?: number;
    storage?: number;
    teamMembers?: number;
  };
  metadata?: Record<string, any>;
  created_at: string;
}

export interface ISubscriptionFeature {
  id: string;
  planId: string;
  name: string;
  description: string;
  value: string | number | boolean;
  created_at: string;
}

export interface ISubscriptionUsage {
  id: string;
  subscriptionId: string;
  feature: string;
  used: number;
  limit: number;
  period: string;
  created_at: string;
}

export interface IBillingCycle {
  id: string;
  subscriptionId: string;
  startDate: string;
  endDate: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

export interface IInvoice {
  id: string;
  businessId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  status: string;
  dueDate: string;
  paidAt?: string;
  items: Array<{
    description: string;
    amount: number;
    quantity: number;
  }>;
  created_at: string;
}

export interface IRecurringCharge {
  id: string;
  businessId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  description: string;
  status: string;
  nextChargeDate: string;
  created_at: string;
}
