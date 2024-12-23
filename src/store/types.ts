export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  conversations: Array<{
    id: string;
    content: string;
    timestamp: string;
    conversation_summary?: string;
  }>;
  notes: Array<{
    id: string;
    content: string;
    timestamp: string;
  }>;
}

// export interface AnalyticsData {
//   dailyActiveUsers: number;
//   monthlyActiveUsers: number;
//   revenue: number;
//   userGrowth: number;
//   metrics: {
//     [key: string]: number;
//   };
// }

export interface AnalyticsData{
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  tokenUsage: number;
  costEstimate: number;
  timeRange: string;
}

export interface AppStoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  installed: boolean;
}

export interface BillingInfo {
  plan: string;
  amount: number;
  nextBillingDate: string;
  paymentMethod: {
    type: string;
    last4?: string;
    expiryDate?: string;
  };
  transactions: Array<{
    id: string;
    amount: number;
    date: string;
    status: string;
  }>;
}

export interface RootState {
  user: {
    data: User | null;
    loading: boolean;
    error: string | null;
  };
  customers: {
    data: Customer[];
    selectedCustomer: Customer | null;
    loading: boolean;
    error: string | null;
  };
  analytics: {
    data: AnalyticsData | null;
    loading: boolean;
    error: string | null;
  };
  appStore: {
    items: AppStoreItem[];
    loading: boolean;
    error: string | null;
  };
  billing: {
    data: BillingInfo | null;
    loading: boolean;
    error: string | null;
  };
}
