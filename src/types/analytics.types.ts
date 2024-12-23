export interface IAnalyticsMetric {
  id: string;
  applicationId: string;
  metricType: string;
  value: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface IUsageMetrics {
  totalTokens: number;
  totalConversations: number;
  totalCustomers: number;
  averageResponseTime: number;
  period: string;
}

export interface IConversationMetrics {
  totalConversations: number;
  averageDuration: number;
  completionRate: number;
  satisfactionRate: number;
  period: string;
}

export interface ICustomerMetrics {
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  period: string;
}

export interface IAgentMetrics {
  totalAgents: number;
  activeAgents: number;
  averageResponseTime: number;
  successRate: number;
  period: string;
}

export interface ITokenMetrics {
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  cost: number;
  period: string;
}

export interface IAnalyticsReport {
  id: string;
  applicationId: string;
  type: string;
  startDate: string;
  endDate: string;
  metrics: Record<string, any>;
  created_at: string;
}
