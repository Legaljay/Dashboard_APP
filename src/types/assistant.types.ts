export interface IAssistant {
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

export interface IAssistantFeature {
  id: string;
  assistantId: string;
  name: string;
  description: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface IAssistantInstruction {
  id: string;
  assistantId: string;
  categoryId?: string;
  content: string;
  priority: number;
  status: string;
  created_at: string;
}

export interface IAssistantInstructionCategory {
  id: string;
  assistantId: string;
  name: string;
  description: string;
  priority: number;
  created_at: string;
}

export interface IAssistantMemory {
  id: string;
  assistantId: string;
  type: string;
  content: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface IAssistantTemplate {
  id: string;
  assistantId: string;
  name: string;
  description: string;
  content: string;
  variables: string[];
  created_at: string;
}

export interface IAssistantAnalytics {
  id: string;
  assistantId: string;
  totalCalls: number;
  successfulCalls: number;
  averageResponseTime: number;
  tokenUsage: number;
  period: string;
  created_at: string;
}

export interface IAssistantCreate {
  businessId: string;
  name: string;
  description?: string;
  sale_agent_name: string;
  type: string;
  personality_type: string;
  file?: {
    [key: string]: any;
  };
}
