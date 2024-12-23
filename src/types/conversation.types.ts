export interface IConversation {
  id: string;
  applicationId: string;
  sessionId: string;
  customerId?: string;
  status: string;
  channel: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface IConversationMessage {
  id: string;
  conversationId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  role: 'user' | 'assistant' | 'system';
  metadata?: Record<string, any>;
  created_at: string;
}

export interface IConversationSummary {
  id: string;
  conversationId: string;
  summary: string;
  created_at: string;
}

export interface ICustomerConversation {
  id: string;
  applicationId: string;
  customerId: string;
  rating?: number;
  feedback?: string;
  status: string;
  created_at: string;
  updated_at: string;
}
