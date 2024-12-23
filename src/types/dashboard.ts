export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface DashboardStats {
  totalRequests: number;
  activeUsers: number;
  successRate: number;
  responseTime: number;
}

export interface AppStoreItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  price: number;
  installed: boolean;
}

export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  isPopular?: boolean;
  isCurrent?: boolean;
}

export interface AnalyticsData {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  tokenUsage: number;
  costEstimate: number;
  timeRange: string;
}
