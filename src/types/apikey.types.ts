import { IApiResponse } from './common.types';

export interface ApiKeyData {
    active: boolean;
    id: string;
    public_key: string;
    secret_key: string;
    created_at: string;
    updated_at: string;
}

export interface ApiKeyState extends ApiKeyData {
  loading: boolean;
  error: string | null;
  resetting: boolean;
}

export type ApiKeyFetchResponse = IApiResponse<ApiKeyData>;

export interface GenerateApiKeyResponse extends IApiResponse<ApiKeyData> {
  status: boolean;
  message: string;
}

export interface ResetApiKeyResponse extends IApiResponse<ApiKeyData> {
  status: boolean;
  message: string;
}