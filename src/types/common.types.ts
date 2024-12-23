export interface IServiceResponse<T = any, U = any> {
  data?: T;
  meta?: U;
}

export interface IApiError {
  status: boolean;
  message: string;
}

export interface IApiResponse<T = any> {
  status: boolean;
  message: string;
  data: T;
}
