export interface IApplicationSettings {
  id: string;
  applicationId: string;
  category: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface IUserPreferences {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface IBusinessSettings {
  id: string;
  businessId: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  language: string;
  branding: {
    logo?: string;
    favicon?: string;
    colors: {
      primary: string;
      secondary: string;
    };
  };
  security: {
    mfaRequired: boolean;
    passwordPolicy: {
      minLength: number;
      requireSpecialChars: boolean;
      requireNumbers: boolean;
      requireUppercase: boolean;
    };
    sessionTimeout: number;
  };
  created_at: string;
  updated_at: string;
}

export interface IIntegrationSettings {
  id: string;
  businessId: string;
  provider: string;
  config: Record<string, any>;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface IEmailSettings {
  id: string;
  businessId: string;
  provider: string;
  fromEmail: string;
  fromName: string;
  replyTo?: string;
  templates: {
    welcome?: string;
    passwordReset?: string;
    invitation?: string;
  };
  config: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface IApiSettings {
  id: string;
  businessId: string;
  rateLimit: {
    enabled: boolean;
    limit: number;
    window: number;
  };
  cors: {
    enabled: boolean;
    origins: string[];
    methods: string[];
  };
  webhooks: {
    enabled: boolean;
    signatureKey?: string;
    retryCount: number;
  };
  created_at: string;
  updated_at: string;
}
