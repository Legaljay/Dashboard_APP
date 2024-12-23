interface IUserConfig {
  customer: boolean;
  welcomeGuide: boolean;
  settings: boolean;
  billing: boolean;
  bottomBilling: boolean;
}

export interface IUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  country: string;
  is_verified: boolean;
  config: IUserConfig;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ILoginResponse {
  status: boolean;
  message: string;
  data: {
    setup_business: boolean;
    user: IUser;
    token: string;
  };
}

export interface IAuthResponse {
  status: boolean;
  message: string;
  data: {
    setup_business: boolean;
    user: IUser;
    token: string;
  };
  token: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  business?: {
    id: string;
    name: string;
    business_email: string;
  };
}

export interface IMFASetup {
  id: string;
  userId: string;
  type: 'email' | 'authenticator';
  status: string;
  secret?: string;
  created_at: string;
}

export interface IMFAVerification {
  code: string;
  type: 'email' | 'authenticator';
}

export interface IAPIKey {
  id: string;
  businessId: string;
  name: string;
  key: string;
  type: 'test' | 'live';
  lastUsed?: string;
  created_at: string;
  expires_at?: string;
}

export interface IPermission {
  id: string;
  name: string;
  description: string;
  group: string;
}

export interface IRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  created_at: string;
}

export interface IRolePermission {
  roleId: string;
  permissionId: string;
}

export interface ApiError {
  status: boolean;
  message: string;
  data?: null;
}
