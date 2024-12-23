export interface IPlugin {
  id: string;
  applicationId: string;
  name: string;
  description: string;
  type: string;
  version: string;
  status: string;
  config?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface IPluginFeature {
  id: string;
  pluginId: string;
  name: string;
  description: string;
  type: string;
  status: string;
  config?: Record<string, any>;
  created_at: string;
}

export interface IPluginConfig {
  id: string;
  pluginId: string;
  key: string;
  value: string;
  type: string;
  isSecret: boolean;
  created_at: string;
}

export interface IPluginLog {
  id: string;
  pluginId: string;
  type: string;
  message: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface IPluginIntegration {
  id: string;
  pluginId: string;
  provider: string;
  credentials?: Record<string, any>;
  settings?: Record<string, any>;
  status: string;
  created_at: string;
}

export interface IPluginWebhook {
  id: string;
  pluginId: string;
  url: string;
  events: string[];
  secret?: string;
  status: string;
  created_at: string;
}

export interface IPluginUsage {
  id: string;
  pluginId: string;
  type: string;
  count: number;
  metadata?: Record<string, any>;
  period: string;
  created_at: string;
}
