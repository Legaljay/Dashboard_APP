export interface Business {
  id: string;
  name: string;
  website_url: string;
  description: string;
  country: string;
  business_email: string;
  team_size: string;
  category: string;
  purpose: string;
  subscription_plan: string | null;
  setup_assist_count: number;
  setup_assist_date: string;
  team: Array<{
    id: string;
    role: {
      id: string;
      name: string;
      description: string | null;
      permission: string[];
    };
    invite_code: string | null;
    invite_email: string;
    invitation_status: string;
    default: boolean;
    invite_accepted: boolean;
    business: Business | null;
    user: {
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
    };
    created_at: string;
    updated_at: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface IBusinessResponse {
  status: boolean;
  message: string;
  data: Business;
}

export interface IBusinessListResponse {
  status: boolean;
  message: string;
  data: Business[];
}

export interface BusinessRegistration {
  name: string;
  businessEmail: string;
  websiteUrl?: string;
  description?: string;
  teamSize?: number;
  category: string;
  industry?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  contact?: {
    phone?: string;
    alternativeEmail?: string;
  };
}

export interface BusinessCompliance {
  id: string;
  businessId: string;
  registrationNumber?: string;
  registrationType?: 'llc' | 'corporation' | 'partnership' | 'soleProprietorship' | 'other';
  registrationCountry?: string;
  registrationState?: string;
  taxId?: string;
  vatNumber?: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  documents?: Array<{
    id: string;
    type: string;
    url: string;
    expiryDate?: string;
    status: 'valid' | 'expired' | 'pending';
  }>;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'failed';
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessTeamMember {
  id: string;
  businessId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  permissions: string[];
  status: 'active' | 'inactive' | 'invited';
  invitedBy?: string;
  invitedAt?: string;
  joinedAt?: string;
  lastActive?: string;
}

export interface BusinessInvitation {
  id: string;
  businessId: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  invitedBy: string;
  permissions: string[];
  token: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessStats {
  id: string;
  businessId: string;
  teamSize: number;
  activeProjects: number;
  totalProjects: number;
  storageUsed: number;
  apiCalls: {
    total: number;
    successful: number;
    failed: number;
    lastCall?: string;
  };
  lastActive?: string;
  updatedAt: string;
}

export interface BusinessCreate {
  name: string;
  description: string;
  team_size: string;
  category: string;
  website_url: string;
  purpose_for_wano: string;
  business_email: string;
  country: string;
}

export interface UpdateBusinessRequest {
  name?: string;
  businessEmail?: string;
  websiteUrl?: string;
  description?: string;
  teamSize?: number;
  category?: string;
  industry?: string;
  logo?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    alternativeEmail?: string;
  };
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  settings?: {
    timezone?: string;
    dateFormat?: string;
    currency?: string;
    language?: string;
  };
}

export interface UpdateComplianceRequest {
  registrationNumber?: string;
  registrationType?: 'llc' | 'corporation' | 'partnership' | 'soleProprietorship' | 'other';
  registrationCountry?: string;
  registrationState?: string;
  taxId?: string;
  vatNumber?: string;
  documents?: Array<{
    type: string;
    url: string;
    expiryDate?: string;
  }>;
}

export interface BusinessWallet {
  id: string;
  businessId: string;
  balance: number;
  currency: string;
  status: 'active' | 'frozen' | 'suspended';
  lastTransaction?: {
    id: string;
    type: 'credit' | 'debit';
    amount: number;
    timestamp: string;
  };
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessWalletResponse {
  status: boolean;
  message: string;
  data: BusinessWallet;
}

export interface BusinessSubscription {
  id: string;
  businessId: string;
  planId: string;
  planName: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  renewalDate?: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  limits: {
    apiCalls: number;
    storage: number;
    teamMembers: number;
  };
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessCredit {
  id: string;
  businessId: string;
  total: number;
  available: number;
  used: number;
  type: 'prepaid' | 'postpaid';
  status: 'active' | 'expired' | 'suspended';
  expiryDate?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessCreditResponse {
  status: boolean;
  message: string;
  data: BusinessCredit;
}

export interface BusinessCreditUsage {
  id: string;
  businessId: string;
  creditId: string;
  amount: number;
  type: 'api' | 'storage' | 'feature';
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface BusinessCreditUsageResponse {
  status: boolean;
  message: string;
  data: BusinessCreditUsage[];
}

export interface BusinessAnalytics {
  id: string;
  businessId: string;
  period: {
    start: string;
    end: string;
  };
  metrics: {
    apiCalls: {
      total: number;
      successful: number;
      failed: number;
    };
    storage: {
      total: number;
      used: number;
      available: number;
    };
    credits: {
      total: number;
      used: number;
      remaining: number;
    };
    costs: {
      total: number;
      breakdown: Record<string, number>;
    };
  };
  trends: {
    apiCalls: Record<string, number>;
    storage: Record<string, number>;
    credits: Record<string, number>;
  };
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceDTO {
  registrationNumber?: string;
  registrationType?: 'llc' | 'corporation' | 'partnership' | 'soleProprietorship' | 'other';
  registrationCountry?: string;
  registrationState?: string;
  taxId?: string;
  vatNumber?: string;
  documents?: Array<{
    type: string;
    url: string;
    expiryDate?: string;
  }>;
}
