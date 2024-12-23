export interface IErrorResponse {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
  timestamp: string;
}

export interface IValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface IErrorLog {
  id: string;
  applicationId?: string;
  businessId?: string;
  userId?: string;
  type: string;
  message: string;
  code: string;
  stack?: string;
  metadata?: Record<string, any>;
  environment: 'development' | 'staging' | 'production';
  severity: 'info' | 'warning' | 'error' | 'critical';
  created_at: string;
}

export interface ISystemLog {
  id: string;
  type: string;
  component: string;
  action: string;
  status: string;
  message: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface IAuditLog {
  id: string;
  businessId?: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: {
    before: Record<string, any>;
    after: Record<string, any>;
  };
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface IHealthCheck {
  id: string;
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  latency: number;
  message?: string;
  lastCheck: string;
  created_at: string;
}

export interface IErrorReport {
  id: string;
  applicationId?: string;
  type: string;
  summary: string;
  occurrences: number;
  firstSeen: string;
  lastSeen: string;
  status: 'open' | 'investigating' | 'resolved' | 'ignored';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}
