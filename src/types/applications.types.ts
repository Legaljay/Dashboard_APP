export interface Application {
  id: string;
  icon_url: string;
  app_key: string;
  type: string;
  name: string;
  deactivated: boolean;
  is_deleted: boolean;
  config: ApplicationConfig;
  sale_agent_name: string;
  description: string;
  personality_type: string;
  is_light: boolean;
  verbose: string;
  draft: any | null;
  business: ApplicationBusiness;
  created_at: string;
  updated_at: string;
}

export interface ApplicationConfig {
  agent: boolean;
  bottomAgent: boolean;
  features: boolean;
  agentSettings: boolean;
  integration: boolean;
  ask_agent: boolean;
  customers: boolean;
  plugins: boolean;
  bill: boolean;
  confirmModal: boolean;
  testEmployeePopup: boolean;
}

export interface ApplicationBusiness {
  id: string;
  name: string;
  website_url: string;
  description: string;
  country: string;
  business_email: string;
  team_size: string;
  category: string;
  purpose: string;
  subscription_plan: string | null;
  setup_assist_count: number;
  setup_assist_date: string;
  team: any[];
  created_at: string;
  updated_at: string;
}

export interface ApplicationSetupData {
  businessId: string;
  name: string;
  description?: string;
  sale_agent_name: string;
  type: 'customer' | 'sales' | 'generalist';
  personality_type: string;
  file: File;
}

export interface IApplicationResponse {
  status: boolean;
  message: string;
  data: Application[];
}

export interface IUpdateApplication {
  name: string;
  description?: string;
  sale_agent_name: string;
  type: 'customer' | 'sales' | 'generalist';
  personality_type: string;
  verbose: string;
  // icon_url: string;
  // is_light: boolean;
  file: File;
}
