export interface IAgent {
  id: string;
  applicationId: string;
  name: string;
  description: string;
  type: string;
  model: string;
  status: string;
  config: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
  };
  created_at: string;
  updated_at: string;
}

export interface IAgentFeature {
  id: string;
  agentId: string;
  name: string;
  description: string;
  type: string;
  status: string;
  config?: Record<string, any>;
  created_at: string;
}

export interface IAgentInstruction {
  id: string;
  agentId: string;
  categoryId?: string;
  content: string;
  priority: number;
  status: string;
  created_at: string;
}

export interface IAgentInstructionCategory {
  id: string;
  agentId: string;
  name: string;
  description: string;
  priority: number;
  created_at: string;
}

export interface IAgentMemory {
  id: string;
  agentId: string;
  type: string;
  content: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface IAgentTemplate {
  id: string;
  agentId: string;
  name: string;
  description: string;
  content: string;
  variables: string[];
  created_at: string;
}

export interface IAgentAnalytics {
  id: string;
  agentId: string;
  totalCalls: number;
  successfulCalls: number;
  averageResponseTime: number;
  tokenUsage: number;
  period: string;
  created_at: string;
}
