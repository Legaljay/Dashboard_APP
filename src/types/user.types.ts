export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  country: string;
  is_verified: boolean;
  config: {
    customer: boolean;
    welcomeGuide: boolean;
    settings: boolean;
    billing: boolean;
    bottomBilling: boolean;
  };
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegistrationData extends AuthCredentials {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  country?: string;
}

export interface IUserProfileResponse {
  data: UserProfile;
  status: boolean;
  message: string;
}

export interface IUserNotificationsResponse {
  status: boolean;
  message: string;
  data: UserNotification[];
}

export interface UserNotification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'system' | 'security' | 'billing' | 'updates';
  title: string;
  message: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  currency: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    inApp: boolean;
    marketing: boolean;
    security: boolean;
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
  };
  updatedAt: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  type: string;
  action: string;
  description: string;
  metadata: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  location?: {
    country: string;
    city: string;
    timezone: string;
  };
  createdAt: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  avatar?: string;
  country?: string;
  city?: string;
  address?: string;
  company?: string;
  position?: string;
  department?: string;
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
}

export interface UpdatePreferencesRequest {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  timezone?: string;
  dateFormat?: string;
  timeFormat?: '12h' | '24h';
  currency?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
    inApp?: boolean;
    marketing?: boolean;
    security?: boolean;
  };
  accessibility?: {
    highContrast?: boolean;
    largeText?: boolean;
    screenReader?: boolean;
  };
}
