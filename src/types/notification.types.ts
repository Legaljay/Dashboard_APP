export interface INotification {
  id: string;
  userId: string;
  businessId?: string;
  type: string;
  title: string;
  message: string;
  status: 'read' | 'unread';
  metadata?: Record<string, any>;
  created_at: string;
}

export interface IEmailNotification {
  id: string;
  recipientEmail: string;
  subject: string;
  content: string;
  status: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface ITeamNotification {
  id: string;
  teamId: string;
  type: string;
  message: string;
  status: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface INotificationPreference {
  id: string;
  userId: string;
  type: string;
  channel: 'email' | 'in_app' | 'sms';
  enabled: boolean;
  created_at: string;
}

export interface INotificationTemplate {
  id: string;
  type: string;
  title: string;
  content: string;
  variables: string[];
  created_at: string;
}

export interface IWebhookEvent {
  id: string;
  applicationId: string;
  type: string;
  data: Record<string, any>;
  status: string;
  attempts: number;
  lastAttempt?: string;
  created_at: string;
}
