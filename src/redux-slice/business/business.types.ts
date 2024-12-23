import { Business, BusinessCompliance, BusinessStats, BusinessTeamMember, BusinessInvitation, BusinessWallet, BusinessSubscription, BusinessCredit, BusinessAnalytics, BusinessCreditUsage } from '../../types/business.types';

export interface BusinessState {
  profile: Business | null;
  compliance: BusinessCompliance | null;
  stats: BusinessStats | null;
  analytics: BusinessAnalytics | null;
  teamMembers: BusinessTeamMember[];
  invitations: BusinessInvitation[];
  wallet: BusinessWallet | null;
  subscription: BusinessSubscription | null;
  credits: BusinessCredit | null;
  loading: BusinessLoadingState;
  error: BusinessErrorState;
}

export interface BusinessLoadingState {
  profile: boolean;
  compliance: boolean;
  stats: boolean;
  analytics: boolean;
  team: boolean;
  wallet: boolean;
  credits: boolean;
  subscription: boolean;
  topup: boolean;
}

export interface BusinessErrorState {
  profile: string | null;
  compliance: string | null;
  stats: string | null;
  analytics: string | null;
  team: string | null;
  wallet: string | null;
  credits: string | null;
  subscription: string | null;
  topup: string | null;
}

export interface BusinessCreateDTO {
  name: string;
  type: string;
  industry: string;
  size: string;
  country: string;
}

export interface TopUpRequestDTO {
  amount: number;
  currency: string;
}

export interface BusinessOverview {
  profile: Business | null;
  stats: BusinessStats | null;
  wallet: {
    amount: number;
    currency: string;
  };
  credits: number;
  teamSize: number;
  hasActiveSubscription: boolean;
  isVerified: boolean;
}

export interface BusinessLoadingStates {
  isLoading: boolean;
  states: BusinessLoadingState;
}

export interface BusinessErrorStates {
  hasErrors: boolean;
  errors: BusinessErrorState;
}

export interface BusinessResponse<T = void> {
  status: boolean;
  message: string;
  data?: T;
}

export interface BusinessTeamInviteDTO {
  email: string;
  role: string;
  permissions: string[];
}

export interface BusinessTeamUpdateDTO {
  memberId: string;
  role: string;
  permissions: string[];
}

export interface BusinessSubscriptionResponse extends BusinessResponse<BusinessSubscription> {
  nextBillingDate?: string;
  isAutoRenewEnabled?: boolean;
}

export interface BusinessCreditResponse extends BusinessResponse<BusinessCredit> {
  usageHistory?: BusinessCreditUsage[];
}

export interface BusinessWalletResponse extends BusinessResponse<BusinessWallet> {
  recentTransactions?: Array<{
    id: string;
    type: 'credit' | 'debit';
    amount: number;
    timestamp: string;
    description?: string;
  }>;
}
