export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'customer';
  companyId?: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  plan: 'free' | 'pro' | 'enterprise';
}

export interface DashboardStats {
  totalCustomers: number;
  activeChats: number;
  resolvedChats: number;
  satisfaction: number;
}

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  children?: MenuItem[];
}
