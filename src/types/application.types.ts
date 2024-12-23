export interface Application {
  id: string;
  businessId: string;
  name: string;
  description: string;
  type: 'web' | 'mobile' | 'desktop' | 'api';
  status: 'active' | 'inactive' | 'suspended' | 'development';
  iconUrl?: string;
  appKey: string;
  isProduction: boolean;
  settings: {
    theme: {
      primary: string;
      secondary: string;
      accent: string;
    };
    branding: {
      logo?: string;
      favicon?: string;
      colors: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
      };
    };
    security: {
      requireMfa: boolean;
      sessionTimeout: number;
      allowedIps?: string[];
      corsOrigins?: string[];
    };
  };
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationFeature {
  id: string;
  applicationId: string;
  name: string;
  description: string;
  type: string;
  status: 'enabled' | 'disabled' | 'beta';
  configuration?: {
    settings: Record<string, any>;
    permissions: string[];
    dependencies?: string[];
  };
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationPlugin {
  id: string;
  applicationId: string;
  name: string;
  version: string;
  description: string;
  type: string;
  status: 'active' | 'inactive' | 'error';
  author?: string;
  website?: string;
  repository?: string;
  configuration?: {
    settings: Record<string, any>;
    permissions: string[];
    dependencies: string[];
  };
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationWidget {
  id: string;
  applicationId: string;
  name: string;
  description?: string;
  type: string;
  status: 'active' | 'inactive';
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  configuration?: {
    settings: Record<string, any>;
    dataSource?: {
      type: string;
      endpoint?: string;
      refreshInterval?: number;
    };
    styling?: Record<string, any>;
  };
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationAgent {
  id: string;
  applicationId: string;
  name: string;
  description: string;
  type: 'chatbot' | 'automation' | 'integration';
  status: 'active' | 'inactive' | 'error';
  capabilities: string[];
  configuration?: {
    settings: Record<string, any>;
    permissions: string[];
    schedule?: {
      type: 'interval' | 'cron';
      value: string;
    };
  };
  metadata?: Record<string, any>;
  lastRun?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationStats {
  id: string;
  applicationId: string;
  usage: {
    apiCalls: number;
    storage: number;
    bandwidth: number;
    users: number;
  };
  performance: {
    responseTime: number;
    uptime: number;
    errors: number;
  };
  limits: {
    apiCalls: number;
    storage: number;
    bandwidth: number;
    users: number;
  };
  billing: {
    plan: string;
    usage: number;
    limit: number;
  };
  updatedAt: string;
}

export interface CreateApplicationRequest {
  name: string;
  description: string;
  type: 'web' | 'mobile' | 'desktop' | 'api';
  iconUrl?: string;
  settings?: {
    theme?: {
      primary?: string;
      secondary?: string;
      accent?: string;
    };
    branding?: {
      logo?: string;
      favicon?: string;
      colors?: {
        primary?: string;
        secondary?: string;
        background?: string;
        text?: string;
      };
    };
    security?: {
      requireMfa?: boolean;
      sessionTimeout?: number;
      allowedIps?: string[];
      corsOrigins?: string[];
    };
  };
}

export interface UpdateApplicationRequest {
  name?: string;
  description?: string;
  iconUrl?: string;
  settings?: {
    theme?: {
      primary?: string;
      secondary?: string;
      accent?: string;
    };
    branding?: {
      logo?: string;
      favicon?: string;
      colors?: {
        primary?: string;
        secondary?: string;
        background?: string;
        text?: string;
      };
    };
    security?: {
      requireMfa?: boolean;
      sessionTimeout?: number;
      allowedIps?: string[];
      corsOrigins?: string[];
    };
  };
  metadata?: Record<string, any>;
}


