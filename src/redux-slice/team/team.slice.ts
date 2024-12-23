import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import { replaceUrlParams } from '@/utils/api.utils';

interface TeamMember {
  id: string;
  email: string;
  role: string;
  status: 'active' | 'pending' | 'inactive';
}

interface TeamState {
  members: TeamMember[];
  roles: string[];
  loading: boolean;
  error: string | null;
}

interface TeamInvitePayload {
  email: string;
  role: string;
}

const initialState: TeamState = {
  members: [],
  roles: [],
  loading: false,
  error: null
};

// Async Thunks
export const fetchTeamMembers = createAsyncThunk(
  'team/fetchMembers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<TeamMember[]>(ApiEndpoints.BUSINESS_TEAM_MEMBERS);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch team members');
    }
  }
);

export const inviteTeamMember = createAsyncThunk(
  'team/inviteMember',
  async (data: TeamInvitePayload, { rejectWithValue }) => {
    try {
      const response = await api.post<TeamMember>(ApiEndpoints.BUSINESS_TEAM_INVITE, data);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to invite team member');
    }
  }
);

export const acceptTeamInvite = createAsyncThunk(
  'team/acceptInvite',
  async ({ token, ...data }: TeamInvitePayload & { token: string }, { rejectWithValue }) => {
    try {
      const url = replaceUrlParams(ApiEndpoints.BUSINESS_TEAM_ACCEPT, { ':token': token });
      const response = await api.post<TeamMember>(url, data);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to accept team invite');
    }
  }
);

export const verifyInviteTeam = createAsyncThunk(
  'team/verifyInvite',
  async ({ token, ...data }: TeamInvitePayload & { token: string }, { rejectWithValue }) => {
    try {
      const url = replaceUrlParams(ApiEndpoints.BUSINESS_TEAM_INVITE_VERIFY, { ':token': token });
      const response = await api.post(url, data);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to verify team invite');
    }
  }
);

export const joinTeam = createAsyncThunk(
  'team/joinTeam',
  async ({ token, ...data }: TeamInvitePayload & { token: string }, { rejectWithValue }) => {
    try {
      const url = replaceUrlParams(ApiEndpoints.BUSINESS_TEAM_JOIN, { ':token': token });
      const response = await api.post<TeamMember>(url, data);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to join team');
    }
  }
);

export const teamMemberRoles = createAsyncThunk(
  'team/teamMemberRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<string[]>(ApiEndpoints.BUSINESS_TEAM_ROLES);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch team roles');
    }
  }
);

export const updateTeamMemberRole = createAsyncThunk(
  'team/updateMemberRole',
  async ({ memberId, role }: { memberId: string; role: string }, { rejectWithValue }) => {
    try {
      const url = replaceUrlParams(ApiEndpoints.BUSINESS_TEAM_MEMBER_UPDATE, { ':id': memberId });
      const response = await api.put<TeamMember>(url, { role });
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to update member role');
    }
  }
);

export const removeTeamMember = createAsyncThunk(
  'team/removeMember',
  async (memberId: string, { rejectWithValue }) => {
    try {
      const url = replaceUrlParams(ApiEndpoints.BUSINESS_TEAM_MEMBER_REMOVE, { ':id': memberId });
      await api.delete(url);
      return memberId;
    } catch (error) {
      return rejectWithValue('Failed to remove team member');
    }
  }
);

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Team Members
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action: PayloadAction<TeamMember[]>) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Invite Team Member
      .addCase(inviteTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(inviteTeamMember.fulfilled, (state, action: PayloadAction<TeamMember>) => {
        state.loading = false;
        state.members.push(action.payload);
      })
      .addCase(inviteTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Team Member Role
      .addCase(updateTeamMemberRole.fulfilled, (state, action: PayloadAction<TeamMember>) => {
        const index = state.members.findIndex(member => member.id === action.payload.id);
        if (index !== -1) {
          state.members[index] = action.payload;
        }
      })

      // Remove Team Member
      .addCase(removeTeamMember.fulfilled, (state, action: PayloadAction<string>) => {
        state.members = state.members.filter(member => member.id !== action.payload);
      })

      // Team Member Roles
      .addCase(teamMemberRoles.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.roles = action.payload;
      });
  },
});

export const { clearError } = teamSlice.actions;
export default teamSlice.reducer;
