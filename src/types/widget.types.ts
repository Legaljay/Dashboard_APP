export interface IWidgetSettings {
  id: string;
  applicationId: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    textColor: string;
    backgroundColor: string;
  };
  display: {
    position: 'left' | 'right';
    offset: number;
    size: 'small' | 'medium' | 'large';
  };
  chatWindow: {
    headerText: string;
    welcomeMessage: string;
    placeholderText: string;
  };
  branding: {
    logo?: string;
    name: string;
    showPoweredBy: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface IWidgetCustomization {
  id: string;
  applicationId: string;
  css?: string;
  javascript?: string;
  html?: string;
  created_at: string;
}

export interface IWidgetDevice {
  id: string;
  applicationId: string;
  deviceId: string;
  deviceType: string;
  browserInfo: string;
  osInfo: string;
  created_at: string;
}

export interface IWidgetSession {
  id: string;
  applicationId: string;
  deviceId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  status: string;
  created_at: string;
}

export interface IWidgetAnalytics {
  id: string;
  applicationId: string;
  totalSessions: number;
  averageSessionDuration: number;
  totalInteractions: number;
  deviceBreakdown: Record<string, number>;
  period: string;
  created_at: string;
}

export interface IWidgetFeedback {
  id: string;
  applicationId: string;
  sessionId: string;
  rating: number;
  feedback?: string;
  created_at: string;
}
