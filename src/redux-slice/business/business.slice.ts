import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import {
  // BusinessState,
  // BusinessLoadingState,
  // BusinessErrorState,
  BusinessCreateDTO,
  TopUpRequestDTO,
  BusinessResponse,
  BusinessTeamInviteDTO,
  BusinessTeamUpdateDTO,
  BusinessSubscriptionResponse,
  BusinessCreditResponse,
  BusinessWalletResponse
} from './business.types';
import {
  Business,
  BusinessCompliance,
  BusinessStats,
  BusinessTeamMember,
  BusinessInvitation,
  BusinessWallet,
  BusinessSubscription,
  BusinessCredit,
  BusinessCreditUsage,
  BusinessAnalytics,
  IBusinessListResponse,
  BusinessCreate,
  IBusinessResponse,
  BusinessCreditUsageResponse,
} from '../../types/business.types';
import { replaceUrlParams } from '@/utils/api.utils';
import { ITeamMember, ITeamRole } from '@/types';
import { fetchApplications } from '../applications/applications.slice';
import { fetchNotifications } from '../notifications/notifications.slice';
import { fetchUserProfile } from '../user/user.slice';

interface BusinessLoadingState {
  activeBusiness: boolean;
  businesses: boolean;
  compliance: boolean;
  stats: boolean;
  analytics: boolean;
  wallet: boolean;
  subscription: boolean;
  availableSubscriptions: boolean;
  credits: boolean;
  creditsUsage: boolean;
  createBusiness: boolean;
  upgradePlan: boolean;
  downgradePlan: boolean;
  requestEnterprise: boolean;
  generateTopUp: boolean;
  createGiftCard: boolean;
  redeemGiftCard: boolean;
}

interface BusinessErrorState {
  activeBusiness: string | null;
  businesses: string | null;
  compliance: string | null;
  stats: string | null;
  analytics: string | null;
  wallet: string | null;
  subscription: string | null;
  availableSubscriptions: string | null;
  credits: string | null;
  creditsUsage: string | null;
  createBusiness: string | null;
  upgradePlan: string | null;
  downgradePlan: string | null;
  requestEnterprise: string | null;
  generateTopUp: string | null;
  createGiftCard: string | null;
  redeemGiftCard: string | null;
}

const initialLoadingState: BusinessLoadingState = {
  activeBusiness: false,
  businesses: false,
  compliance: false,
  stats: false,
  analytics: false,
  wallet: false,
  subscription: false,
  availableSubscriptions: false,
  credits: false,
  creditsUsage: false,
  createBusiness: false,
  upgradePlan: false,
  downgradePlan: false,
  requestEnterprise: false,
  generateTopUp: false,
  createGiftCard: false,
  redeemGiftCard: false,
};

const initialErrorState: BusinessErrorState = {
  activeBusiness: null,
  businesses: null,
  compliance: null,
  stats: null,
  analytics: null,
  wallet: null,
  subscription: null,
  availableSubscriptions: null,
  credits: null,
  creditsUsage: null,
  createBusiness: null,
  upgradePlan: null,
  downgradePlan: null,
  requestEnterprise: null,
  generateTopUp: null,
  createGiftCard: null,
  redeemGiftCard: null,
};

interface BusinessState {
  activeBusiness: Business | null;
  businesses: Business[] | null;
  compliance: BusinessCompliance | null;
  stats: BusinessStats | null;
  analytics: BusinessAnalytics | null;
  team: {
    members: ITeamMember[];
    roles: ITeamRole[];
    invitations: BusinessInvitation[];
    loading: {
      members: boolean;
      roles: boolean;
      invite: boolean;
      remove: boolean;
      update: boolean;
      verify: boolean;
      join: boolean;
      accept: boolean;
    };
    error: {
      members: string | null;
      roles: string | null;
      invite: string | null;
      remove: string | null;
      update: string | null;
      verify: string | null;
      join: string | null;
      accept: string | null;
    };
  };
  wallet: BusinessWallet | null;
  subscription: BusinessSubscription | null;
  availableSubscriptions: BusinessSubscription[] | null;
  credits: BusinessCredit | null;
  creditsUsage: BusinessCreditUsage[] | null;
  loading: BusinessLoadingState;
  error: BusinessErrorState;
}

const initialState: BusinessState = {
  activeBusiness: null,
  businesses: null,
  compliance: null,
  stats: null,
  analytics: null,
  team: {
    members: [],
    roles: [],
    invitations: [],
    loading: {
      members: false,
      roles: false,
      invite: false,
      remove: false,
      update: false,
      verify: false,
      join: false,
      accept: false,
    },
    error: {
      members: null,
      roles: null,
      invite: null,
      remove: null,
      update: null,
      verify: null,
      join: null,
      accept: null,
    },
  },
  wallet: null,
  subscription: null,
  availableSubscriptions: null,
  credits: null,
  creditsUsage: null,
  loading: initialLoadingState,
  error: initialErrorState,
};

// Create Business
export const createBusiness = createAsyncThunk(
  'business/createBusiness',
  async (data: BusinessCreate, { rejectWithValue }) => {
    try {
      const response = await api.post<IBusinessResponse>(ApiEndpoints.BUSINESS_CREATE, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create business');
    }
  }
);

// All Businesses
export const fetchBusinesses = createAsyncThunk(
  'business/fetchBusinesses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<IBusinessListResponse>(ApiEndpoints.BUSINESS_ALL);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch businesses');
    }
  }
);

// Business Profile
export const fetchBusinessProfile = createAsyncThunk(
  'business/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<BusinessResponse<Business>>(ApiEndpoints.BUSINESS_ACTIVE);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch business profile');
    }
  }
);

// Fetch Single Business
export const fetchBusinessById = createAsyncThunk(
  'business/fetchById',
  async (businessId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<BusinessResponse<Business>>(
        replaceUrlParams(ApiEndpoints.BUSINESS_SINGLE, { id: businessId })
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch business');
    }
  }
);

// Switch Business
export const switchBusiness = createAsyncThunk(
  'business/switch',
  async (businessId: string, { rejectWithValue }) => {
    try {
      const response = await api.put<BusinessResponse<Business>>(
        replaceUrlParams(ApiEndpoints.BUSINESS_SWITCH, { id: businessId })
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to switch business');
    }
  }
);

export const updateBusinessProfile = createAsyncThunk(
  'business/updateProfile',
  async (data: Partial<Business>, { rejectWithValue }) => {
    try {
      const response = await api.put<BusinessResponse<Business>>(ApiEndpoints.BUSINESS_UPDATE, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update business profile');
    }
  }
);

// Business Compliance
export const fetchBusinessCompliance = createAsyncThunk(
  'business/fetchCompliance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<BusinessResponse<BusinessCompliance>>(ApiEndpoints.BUSINESS_COMPLIANCE);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch compliance data');
    }
  }
);

// Business Analytics
export const fetchBusinessAnalytics = createAsyncThunk(
  'business/fetchAnalytics',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<BusinessResponse<BusinessAnalytics>>(
        ApiEndpoints.APP_ANALYTICS.replace(':applicationId', applicationId)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

// Business Team Management
export const fetchTeamMembers = createAsyncThunk(
  'business/fetchTeamMembers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<BusinessResponse<ITeamMember[]>>(ApiEndpoints.BUSINESS_TEAM_MEMBERS);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch team members');
    }
  }
);

export const fetchTeamRoles = createAsyncThunk(
  'business/fetchTeamRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<BusinessResponse<ITeamRole[]>>(ApiEndpoints.BUSINESS_TEAM_ROLES);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch team roles');
    }
  }
);

export const inviteTeamMember = createAsyncThunk(
  'business/inviteTeamMember',
  async (data: BusinessTeamInviteDTO, { rejectWithValue }) => {
    try {
      const response = await api.post<BusinessResponse<BusinessInvitation>>(
        ApiEndpoints.BUSINESS_TEAM_INVITE,
        data
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to invite team member');
    }
  }
);

export const updateTeamMember = createAsyncThunk(
  'business/updateTeamMember',
  async (data: BusinessTeamUpdateDTO, { rejectWithValue }) => {
    try {
      const response = await api.put<BusinessResponse<ITeamMember>>(
        ApiEndpoints.BUSINESS_TEAM_MEMBER_UPDATE.replace(':id', data.memberId),
        { role: data.role, permissions: data.permissions }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update team member');
    }
  }
);

export const removeTeamMember = createAsyncThunk(
  'business/removeTeamMember',
  async (memberId: string, { rejectWithValue }) => {
    try {
      await api.delete(ApiEndpoints.BUSINESS_TEAM_MEMBER_REMOVE.replace(':id', memberId));
      return memberId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove team member');
    }
  }
);

export const verifyTeamInvite = createAsyncThunk(
  'business/verifyTeamInvite',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await api.get<BusinessResponse<BusinessInvitation>>(
        ApiEndpoints.BUSINESS_TEAM_INVITE_VERIFY.replace(':token', token)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify team invite');
    }
  }
);

export const joinTeam = createAsyncThunk(
  'business/joinTeam',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await api.post<BusinessResponse<ITeamMember>>(
        ApiEndpoints.BUSINESS_TEAM_JOIN.replace(':token', token)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to join team');
    }
  }
);

export const acceptTeamInvite = createAsyncThunk(
  'business/acceptTeamInvite',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await api.post<BusinessResponse<ITeamMember>>(
        ApiEndpoints.BUSINESS_TEAM_ACCEPT.replace(':token', token)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to accept team invite');
    }
  }
);

// Wallet
export const fetchWallet = createAsyncThunk(
  'business/fetchWallet',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<BusinessWalletResponse>(ApiEndpoints.BUSINESS_WALLET);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wallet');
    }
  }
);

// Credits
export const fetchCredits = createAsyncThunk(
  'business/fetchCredits',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<BusinessCreditResponse>(ApiEndpoints.BUSINESS_CREDITS);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch credits');
    }
  }
);

// Credits usage
export const fetchCreditsUsage = createAsyncThunk(
  'business/fetchCreditsUsage',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<BusinessCreditUsageResponse>(ApiEndpoints.BUSINESS_CREDITS_USAGE);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch credits usage');
    }
  }
);

// Business Subscriptions
export const fetchCurrentSubscription = createAsyncThunk(
  'business/fetchCurrentSubscription',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<BusinessSubscriptionResponse>(ApiEndpoints.BUSINESS_SUBSCRIPTION_CURRENT);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscription');
    }
  }
);

export const fetchAvailableSubscriptions = createAsyncThunk(
  'business/fetchAvailableSubscriptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<BusinessSubscriptionResponse[]>(ApiEndpoints.BUSINESS_SUBSCRIPTIONS_AVAILABLE);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscriptions');
    }
  }
);

export const upgradeSubscription = createAsyncThunk(
  'business/upgradeSubscription',
  async (baseSubId: string, { rejectWithValue }) => {
    try {
      const response = await api.post<BusinessSubscriptionResponse>(
        ApiEndpoints.BUSINESS_SUBSCRIPTION_UPGRADE.replace(':base_sub_id', baseSubId)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upgrade subscription');
    }
  }
);

export const downgradeSubscription = createAsyncThunk(
  'business/downgradeSubscription',
  async (baseSubId: string, { rejectWithValue }) => {
    try {
      const response = await api.post<BusinessSubscriptionResponse>(
        ApiEndpoints.BUSINESS_SUBSCRIPTIONS_DOWNGRADE.replace(':base_sub_id', baseSubId)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to downgrade subscription');
    }
  }
);

// Top-up Operations
export const requestEnterprisePayment = createAsyncThunk(
  'business/requestEnterprisePayment',
  async (data: TopUpRequestDTO, { rejectWithValue }) => {
    try {
      const response = await api.post(ApiEndpoints.TOPUP_REQUEST_ENTERPRISE, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to request enterprise payment');
    }
  }
);

export const generateTopUp = createAsyncThunk(
  'business/generateTopUp',
  async (data: TopUpRequestDTO, { rejectWithValue }) => {
    try {
      const response = await api.post(ApiEndpoints.TOPUP_GENERATE, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate top-up');
    }
  }
);

// Gift Cards
export const createGiftCard = createAsyncThunk(
  'business/createGiftCard',
  async (data: { amount: number; currency: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(ApiEndpoints.GIFTCARD_CREATE, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create gift card');
    }
  }
);

export const redeemGiftCard = createAsyncThunk(
  'business/redeemGiftCard',
  async ({ businessId, code }: { businessId: string; code: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        ApiEndpoints.GIFTCARD_REDEEM.replace(':businessId', businessId),
        { code }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to redeem gift card');
    }
  }
);

// Fetch all initial dashboard data in parallel
export const fetchInitialDashboardData = createAsyncThunk(
  "business/fetchInitialDashboardData",
  async (_, { dispatch }) => {
    try {
      // Dispatch all fetch actions in parallel using Promise.all
      await Promise.all([
        dispatch(fetchBusinesses()),
        dispatch(fetchApplications()),
        dispatch(fetchNotifications()),
        dispatch(fetchBusinessProfile()),
        dispatch(fetchUserProfile())
      ]);
    } catch (error) {
      console.error("Error fetching initial dashboard data:", error);
      throw error;
    }
  }
);

// Utility Functions
const handleAsyncState = {
  pending(state: BusinessState, key: keyof BusinessLoadingState) {
    state.loading[key] = true;
    state.error[key] = null;
  },
  fulfilled(state: BusinessState, key: keyof BusinessLoadingState) {
    state.loading[key] = false;
    state.error[key] = null;
  },
  rejected(state: BusinessState, key: keyof BusinessLoadingState, error: string) {
    state.loading[key] = false;
    state.error[key] = error;
  }
};

// Business state update handlers
const businessStateHandlers = {
  updateBusinessInList(state: BusinessState, business: Business) {
    if (state.businesses) {
      const index = state.businesses.findIndex(b => b.id === business.id);
      if (index !== -1) {
        state.businesses[index] = business;
      } else {
        state.businesses.push(business);
      }
    } else {
      state.businesses = [business];
    }
  },
  
  resetBusinessSpecificStates(state: BusinessState) {
    state.compliance = null;
    state.stats = null;
    state.analytics = null;
    state.wallet = null;
    state.subscription = null;
    state.credits = null;
    state.creditsUsage = null;
  }
};

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    clearError(state, action: PayloadAction<keyof BusinessErrorState>) {
      state.error[action.payload] = null;
    },
    clearAllErrors(state) {
      state.error = initialErrorState;
    },
    resetState: () => initialState,
    setBusiness(state, action: PayloadAction<Business>) {
      state.activeBusiness = action.payload;
      businessStateHandlers.updateBusinessInList(state, action.payload);
    },
    resetLoadingStates(state) {
      state.loading = initialLoadingState;
    },
    resetErrorStates(state) {
      state.error = initialErrorState;
    },
  },
  extraReducers: (builder) => {
    builder
      // ============= Business Management Operations =============
      // Create Business
      .addCase(createBusiness.pending, (state) => {
        handleAsyncState.pending(state, 'createBusiness');
      })
      .addCase(createBusiness.fulfilled, (state, action) => {
        businessStateHandlers.updateBusinessInList(state, action.payload.data);
        state.activeBusiness = action.payload.data;
        handleAsyncState.fulfilled(state, 'createBusiness');
      })
      .addCase(createBusiness.rejected, (state, action) => {
        handleAsyncState.rejected(state, 'createBusiness', action.error.message || 'Failed to create business');
      })

      // Fetch All Businesses
      .addCase(fetchBusinesses.pending, (state) => {
        handleAsyncState.pending(state, 'businesses');
      })
      .addCase(fetchBusinesses.fulfilled, (state, action: PayloadAction<IBusinessListResponse>) => {
        state.businesses = action.payload.data;
        handleAsyncState.fulfilled(state, 'businesses');
      })
      .addCase(fetchBusinesses.rejected, (state, action) => {
        handleAsyncState.rejected(state, 'businesses', action.error.message || 'Failed to fetch businesses');
      })

      // Fetch Business By ID 
      .addCase(fetchBusinessById.fulfilled, (state, action) => {
        businessStateHandlers.updateBusinessInList(state, action.payload as Business);
        state.activeBusiness = action.payload as Business;
        handleAsyncState.fulfilled(state, 'activeBusiness');
      })
      .addCase(fetchBusinessById.rejected, (state, action) => {
        handleAsyncState.rejected(state, 'activeBusiness', action.error.message || 'Failed to fetch business');
      })

      // ============= Current Business Profile Operations =============
      // Fetch Active Businesses
      .addCase(fetchBusinessProfile.fulfilled, (state, action) => {
        state.activeBusiness = action.payload as Business;
        businessStateHandlers.updateBusinessInList(state, action.payload as Business);
      })
      .addCase(fetchBusinessProfile.rejected, (state, action) => {
        handleAsyncState.rejected(state, 'activeBusiness', action.error.message || 'Failed to fetch profile');
      })

      // Update Current Business Profile
      .addCase(updateBusinessProfile.fulfilled, (state, action) => {
        const updatedBusiness = { ...state.activeBusiness, ...action.payload.data };
        state.activeBusiness = updatedBusiness as Business;
        businessStateHandlers.updateBusinessInList(state, updatedBusiness as Business);
      })
      .addCase(updateBusinessProfile.rejected, (state, action) => {
        handleAsyncState.rejected(state, 'activeBusiness', action.error.message || 'Failed to update profile');
      })

      // Switch Current Business
      .addCase(switchBusiness.fulfilled, (state, action) => {
        state.activeBusiness = action.payload.data as Business;
        businessStateHandlers.resetBusinessSpecificStates(state);
      })
      .addCase(switchBusiness.rejected, (state, action) => {
        handleAsyncState.rejected(state, 'activeBusiness', action.error.message || 'Failed to switch business');
      })

      // ============= Business Compliance Operations =============
      .addCase(fetchBusinessCompliance.fulfilled, (state, action) => {
        state.compliance = action.payload as BusinessCompliance;
      })
      .addCase(fetchBusinessCompliance.rejected, (state, action) => {
        handleAsyncState.rejected(state, 'compliance', action.error.message || 'Failed to fetch compliance');
      })

      // ============= Business Analytics Operations =============
      .addCase(fetchBusinessAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload as BusinessAnalytics;
      })
      .addCase(fetchBusinessAnalytics.rejected, (state, action) => {
        handleAsyncState.rejected(state, 'analytics', action.error.message || 'Failed to fetch analytics');
      })

      // ============= Team Management Operations =============
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.team.members = action.payload as ITeamMember[];
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.team.error.members = action.payload as string;
      })

      .addCase(fetchTeamRoles.fulfilled, (state, action) => {
        state.team.roles = action.payload as ITeamRole[];
      })
      .addCase(fetchTeamRoles.rejected, (state, action) => {
        state.team.error.roles = action.payload as string;
      })

      .addCase(inviteTeamMember.fulfilled, (state, action) => {
        state.team.invitations.push(action.payload as BusinessInvitation);
      })
      .addCase(inviteTeamMember.rejected, (state, action) => {
        state.team.error.invite = action.payload as string;
      })

      .addCase(updateTeamMember.fulfilled, (state, action) => {
        const index = state.team.members.findIndex(member => member.id === (action.payload as ITeamMember).id);
        if (index !== -1) {
          state.team.members[index] = action.payload as ITeamMember;
        }
      })
      .addCase(updateTeamMember.rejected, (state, action) => {
        state.team.error.update = action.payload as string;
      })

      .addCase(removeTeamMember.fulfilled, (state, action) => {
        state.team.members = state.team.members.filter(member => member.id !== action.payload);
      })
      .addCase(removeTeamMember.rejected, (state, action) => {
        state.team.error.remove = action.payload as string;
      })

      .addCase(verifyTeamInvite.fulfilled, (state, action) => {
        state.team.invitations = state.team.invitations.map(invite => 
          invite.token === action.payload?.token ? action.payload : invite
        );
      })
      .addCase(verifyTeamInvite.rejected, (state, action) => {
        state.team.error.verify = action.payload as string;
      })

      .addCase(joinTeam.fulfilled, (state, action) => {
        state.team.members.push(action.payload as ITeamMember);
      })
      .addCase(joinTeam.rejected, (state, action) => {
        state.team.error.join = action.payload as string;
      })

      .addCase(acceptTeamInvite.fulfilled, (state, action) => {
        state.team.members.push(action.payload as ITeamMember);
      })
      .addCase(acceptTeamInvite.rejected, (state, action) => {
        state.team.error.accept = action.payload as string;
      })

      // ============= Wallet and Credits Operations =============
      .addCase(fetchWallet.pending, (state) => {
        handleAsyncState.pending(state, 'wallet');
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.wallet = action.payload as BusinessWallet;
        handleAsyncState.fulfilled(state, 'wallet');
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        handleAsyncState.rejected(state, 'wallet', action.payload as string);
      })

      .addCase(fetchCredits.pending, (state) => {
        handleAsyncState.pending(state, 'credits');
      })
      .addCase(fetchCredits.fulfilled, (state, action) => {
        state.credits = action.payload as BusinessCredit;
        handleAsyncState.fulfilled(state, 'credits');
      })
      .addCase(fetchCredits.rejected, (state, action) => {
        handleAsyncState.rejected(state, 'credits', action.payload as string);
      })

      .addCase(fetchCreditsUsage.pending, (state) => {
        handleAsyncState.pending(state, 'creditsUsage');
      })
      .addCase(fetchCreditsUsage.fulfilled, (state, action) => {
        state.creditsUsage = action.payload;
        handleAsyncState.fulfilled(state, 'creditsUsage');
      })
      .addCase(fetchCreditsUsage.rejected, (state, action) => {
        handleAsyncState.rejected(state, 'creditsUsage', action.payload as string);
      })

      // ============= Subscription Operations =============
      .addCase(fetchCurrentSubscription.fulfilled, (state, action) => {
        state.subscription = action.payload as BusinessSubscription;
      })
      .addCase(fetchCurrentSubscription.rejected, (state, action) => {
        handleAsyncState.rejected(state, 'subscription', action.error.message || 'Failed to fetch subscription');
      })

      .addCase(fetchAvailableSubscriptions.fulfilled, (state, action) => {
        state.availableSubscriptions = action.payload as unknown as BusinessSubscription[];
      })
      .addCase(fetchAvailableSubscriptions.rejected, (state, action) => {
        handleAsyncState.rejected(state, 'availableSubscriptions', action.error.message || 'Failed to fetch available subscriptions');
      })

      .addCase(upgradeSubscription.fulfilled, (state, action) => {
        state.subscription = action.payload as BusinessSubscription;
      })
      .addCase(upgradeSubscription.rejected, (state, action) => {
        handleAsyncState.rejected(state, 'upgradePlan', action.error.message || 'Failed to upgrade subscription');
      })

      .addCase(downgradeSubscription.fulfilled, (state, action) => {
        state.subscription = action.payload as BusinessSubscription;
      })
      .addCase(downgradeSubscription.rejected, (state, action) => {
        handleAsyncState.rejected(state, 'downgradePlan', action.error.message || 'Failed to downgrade subscription');
      })

      // ============= Top-up Operations =============
      .addCase(requestEnterprisePayment.fulfilled, (state) => {
        handleAsyncState.fulfilled(state, 'requestEnterprise');
      })
      .addCase(requestEnterprisePayment.rejected, (state, action) => {
        handleAsyncState.rejected(state, 'requestEnterprise', action.error.message || 'Failed to request enterprise payment');
      })

      .addCase(generateTopUp.fulfilled, (state) => {
        handleAsyncState.fulfilled(state, 'generateTopUp');
      })
      .addCase(generateTopUp.rejected, (state, action) => {
        handleAsyncState.rejected(state, 'generateTopUp', action.error.message || 'Failed to generate top-up');
      })

      // ============= Gift Card Operations =============
      .addCase(createGiftCard.fulfilled, (state) => {
        handleAsyncState.fulfilled(state, 'createGiftCard');
      })
      .addCase(createGiftCard.rejected, (state, action) => {
        handleAsyncState.rejected(state, 'createGiftCard', action.error.message || 'Failed to create gift card');
      })

      .addCase(redeemGiftCard.fulfilled, (state) => {
        handleAsyncState.fulfilled(state, 'redeemGiftCard');
      })
      .addCase(redeemGiftCard.rejected, (state, action) => {
        handleAsyncState.rejected(state, 'redeemGiftCard', action.error.message || 'Failed to redeem gift card');
      });
  }
});

const selectBusiness = (state: RootState) => state.business;

export const selectBusinessData = createSelector(
  [selectBusiness],
  (business) => ({
    businessData: business.businesses,
    activeBusiness: business.activeBusiness,
  })
);

// Export actions
export const {
  clearError,
  clearAllErrors,
  resetState,
  setBusiness,
  resetLoadingStates,
  resetErrorStates,
} = businessSlice.actions;

export default businessSlice.reducer;
