import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';

interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'compliant' | 'non-compliant' | 'warning';
  lastChecked: string;
}

interface ComplianceAudit {
  id: string;
  date: string;
  type: string;
  findings: any[];
  status: 'completed' | 'in-progress' | 'scheduled';
}

interface ComplianceState {
  rules: ComplianceRule[];
  audits: ComplianceAudit[];
  settings: {
    automaticAudits: boolean;
    notificationThreshold: string;
    retentionPeriod: number;
  };
  currentAudit: ComplianceAudit | null;
  loading: boolean;
  error: string | null;
}

const initialState: ComplianceState = {
  rules: [],
  audits: [],
  settings: {
    automaticAudits: true,
    notificationThreshold: 'warning',
    retentionPeriod: 90,
  },
  currentAudit: null,
  loading: false,
  error: null,
};

export const fetchComplianceRules = createAsyncThunk(
  'compliance/fetchRules',
  async () => {
    const response = await api.get(`${ApiEndpoints.BUSINESS_COMPLIANCE}/rules`);
    return response.data;
  }
);

export const fetchComplianceAudits = createAsyncThunk(
  'compliance/fetchAudits',
  async () => {
    const response = await api.get(`${ApiEndpoints.BUSINESS_COMPLIANCE}/audits`);
    return response.data;
  }
);

export const startComplianceAudit = createAsyncThunk(
  'compliance/startAudit',
  async (auditType: string) => {
    const response = await api.post(`${ApiEndpoints.BUSINESS_COMPLIANCE}/audits`, { type: auditType });
    return response.data;
  }
);

export const updateComplianceSettings = createAsyncThunk(
  'compliance/updateSettings',
  async (settings: ComplianceState['settings']) => {
    const response = await api.put(`${ApiEndpoints.BUSINESS_COMPLIANCE}/settings`, settings);
    return response.data;
  }
);

const complianceSlice = createSlice({
  name: 'compliance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentAudit: (state, action) => {
      state.currentAudit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplianceRules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplianceRules.fulfilled, (state, action) => {
        state.loading = false;
        state.rules = action.payload;
      })
      .addCase(fetchComplianceRules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch compliance rules';
      })
      .addCase(fetchComplianceAudits.fulfilled, (state, action) => {
        state.audits = action.payload;
      })
      .addCase(startComplianceAudit.fulfilled, (state, action) => {
        state.currentAudit = action.payload;
        state.audits.unshift(action.payload);
      })
      .addCase(updateComplianceSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      });
  },
});

export const { clearError, setCurrentAudit } = complianceSlice.actions;
export default complianceSlice.reducer;
