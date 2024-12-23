import React from 'react';
import { Route, Routes, useNavigate, useOutletContext } from 'react-router-dom';
import { IAgent } from '@/types/agent.types';
import './Assistant.css';
import useDataFetching from '@/hooks/useDataFetching';
import { AuthState } from '@/redux-slice/auth/auth.slice';
import AssistantCard from './AssistantCard';
import { useAppSelector } from '@/redux-slice/hooks';
import NotFound from '@/NotFound';

interface AssistantStats {
  totalAssistants: number;
  activeAssistants: number;
  averageResponseTime: number;
  successRate: number;
}

const getAssistantStats = async (): Promise<AssistantStats> => {
  // TODO: Replace with actual API call
  return Promise.resolve({
    totalAssistants: 5,
    activeAssistants: 3,
    averageResponseTime: 1.2, // seconds
    successRate: 95.5, // percentage
  });
};

const getAssistants = async (): Promise<IAgent[]> => {
  // TODO: Replace with actual API call
  return Promise.resolve([
    {
      id: '1',
      applicationId: 'app1',
      name: 'Customer Support Assistant',
      description: 'Handles customer inquiries and support tickets',
      type: 'support',
      model: 'gpt-4',
      status: 'active',
      config: {
        temperature: 0.7,
        maxTokens: 150,
        topP: 1,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    // Add more mock assistants as needed
  ]);
};

const AssistantDashboard: React.FC = () => {
 
  const navigate = useNavigate();
  const state = useOutletContext<{state: AuthState }>();
  const { applications: Assistants, selectedApplication: ActiveAssistant } = useAppSelector(state => state.applications);


  const { 
    data: stats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats
  } = useDataFetching<AssistantStats>(
    getAssistantStats,
    [],
    {
      showToasts: {
        error: true,
        success: false
      },
      toastMessages: {
        error: (error) => `Failed to load assistant statistics: ${error.message}`,
      },
      pollingInterval: 30000,
      pollingEnabled: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      retryCount: 3
    }
  );

  const {
    data: assistants,
    loading: assistantsLoading,
    error: assistantsError,
    refetch: refetchAssistants
  } = useDataFetching<IAgent[]>(
    getAssistants,
    [],
    {
      showToasts: {
        error: true,
        success: false
      },
      toastMessages: {
        error: (error) => `Failed to load assistants: ${error.message}`,
      },
      retryCount: 3
    }
  );

  console.dir(Assistants);

  React.useEffect(() => {
    if (!state.state.isAuthenticated) {
      navigate('/');
    }
  }, [state.state.isAuthenticated, navigate]);

  const handleRefresh = () => {
    refetchStats();
    refetchAssistants();
  };

  if (statsLoading || assistantsLoading) {
    return (
      <div className="assistant-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (statsError || assistantsError) {
    return (
      <div className="assistant-container">
        <div className="error-message">
          {statsError?.message || assistantsError?.message}
          <button 
            onClick={handleRefresh}
            className="retry-button ml-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats || !assistants) return null;

  return (
    <div className="assistant-container">
      <div className="flex justify-between items-center mb-6">
        <h1>AI Assistants</h1>
        <div className="flex gap-4">
          <button
            onClick={handleRefresh}
            className="refresh-button"
            disabled={statsLoading || assistantsLoading}
          >
            {(statsLoading || assistantsLoading) ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={() => navigate('/dashboard/assistant/create-feature')}
            className="create-button"
          >
            Create New Assistant
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Assistants</h3>
          <p>{stats.totalAssistants}</p>
        </div>
        <div className="stat-card">
          <h3>Active Assistants</h3>
          <p>{stats.activeAssistants}</p>
        </div>
        <div className="stat-card">
          <h3>Avg. Response Time</h3>
          <p>{stats.averageResponseTime}s</p>
        </div>
        <div className="stat-card">
          <h3>Success Rate</h3>
          <p>{stats.successRate}%</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Assistants</h2>
        <div className="assistant-grid">
          {Assistants.map((assistant) => (
            <AssistantCard key={assistant.id} assistant={assistant} />
          ))}
        </div>
      </div>
    </div>
  );
};

const Assistant: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AssistantDashboard />} />
      <Route path="/dashboard/assistant/general" element={<NotFound/>}/>
    </Routes>
  );
};

export default Assistant;
