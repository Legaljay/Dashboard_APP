import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { store } from "../redux-slice/store";
import { RootState } from "../redux-slice/store";
import environmentUtil from "@/lib/env.util";

export class ApiService {
  private static instance: ApiService;
  private api: AxiosInstance;

  private constructor() {
    this.api = axios.create({
      baseURL: environmentUtil.BASE_URL,
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": "*",
        // "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private navigateToLogin(): void {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      window.location.href = "/";
    } else {
      console.warn("Navigation attempted in non-browser environment");
    }
  }

  private clearAuthData(): void {
    // Clear redux store
    store.dispatch({ type: "auth/clearCredentials" });
    
    // Clear localStorage if in browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.clear();
    }
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const state = store.getState() as RootState;
        const token = state.auth.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {

            // Only attempt token refresh in browser environment
            if (typeof window === 'undefined' || !window.localStorage) {
              throw new Error('Not in browser environment');
            }

            // Attempt to refresh token
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
              throw new Error('No refresh token found');
            }

            const response = await this.api.post("/auth/refresh", {
              refreshToken,
            });

            if (!response.data) {
              throw new Error('No data received from refresh token request');
            }

            // Extract new token
            const { token } = response.data;

            // Update token in store
            store.dispatch({ type: "auth/setCredentials", payload: { token } });

            // Retry original request
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            // Handle refresh token failure
            this.clearAuthData();
            this.navigateToLogin();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.api.get<T>(url, config);
  }

  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.api.post<T>(url, data, config);
  }

  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.api.put<T>(url, data, config);
  }

  public async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.api.patch<T>(url, data, config);
  }

  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.api.delete<T>(url, config);
  }
}

export const api = ApiService.getInstance();
