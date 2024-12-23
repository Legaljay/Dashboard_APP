export interface IStorageFile {
  id: string;
  businessId: string;
  applicationId?: string;
  name: string;
  path: string;
  type: string;
  size: number;
  mimeType: string;
  metadata?: Record<string, any>;
  url?: string;
  expires?: string;
  created_at: string;
  updated_at: string;
}

export interface IStorageFolder {
  id: string;
  businessId: string;
  applicationId?: string;
  name: string;
  path: string;
  parentId?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface IStoragePermission {
  id: string;
  resourceId: string;
  resourceType: 'file' | 'folder';
  userId?: string;
  teamId?: string;
  permission: 'read' | 'write' | 'admin';
  created_at: string;
}

export interface IStorageQuota {
  id: string;
  businessId: string;
  totalSpace: number;
  usedSpace: number;
  files: number;
  folders: number;
  lastUpdated: string;
  created_at: string;
}

export interface IStorageActivity {
  id: string;
  businessId: string;
  userId: string;
  resourceId: string;
  resourceType: 'file' | 'folder';
  action: 'create' | 'update' | 'delete' | 'move' | 'copy';
  metadata?: Record<string, any>;
  created_at: string;
}

export interface IStorageBackup {
  id: string;
  businessId: string;
  type: 'full' | 'incremental';
  status: string;
  size: number;
  files: number;
  folders: number;
  startTime: string;
  endTime?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface IStorageRetention {
  id: string;
  businessId: string;
  resourceType: 'file' | 'folder';
  duration: number;
  policy: 'delete' | 'archive';
  metadata?: Record<string, any>;
  created_at: string;
}
