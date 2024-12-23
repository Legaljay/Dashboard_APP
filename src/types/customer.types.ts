export interface ICustomer {
  id: string;
  applicationId: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ICustomerSession {
  id: string;
  customerId: string;
  sessionId: string;
  deviceId?: string;
  userAgent?: string;
  ipAddress?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface ICustomerDevice {
  id: string;
  customerId: string;
  deviceId: string;
  deviceType?: string;
  deviceName?: string;
  platform?: string;
  lastActive?: string;
  created_at: string;
}

export interface ICustomerInteraction {
  id: string;
  customerId: string;
  type: string;
  action: string;
  metadata?: Record<string, any>;
  created_at: string;
}
