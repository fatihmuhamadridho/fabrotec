import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { BASE_API_URL } from '../configs/base.config';

export interface AxiosServiceOptions {
  requireAuth?: boolean;
  baseURL?: string;
}

export class AxiosService {
  private readonly client: AxiosInstance;
  private readonly options: AxiosServiceOptions;

  constructor(options?: AxiosServiceOptions) {
    this.options = { requireAuth: true, ...options };

    this.client = axios.create({
      baseURL: this.options.baseURL ?? BASE_API_URL,
      headers: this.options.requireAuth === false ? {} : undefined,
    });
  }

  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get<T>(url, config).then((res) => res.data);
  }

  getWithResponse<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post<T>(url, data, config).then((res) => res.data);
  }

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put<T>(url, data, config).then((res) => res.data);
  }

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.patch<T>(url, data, config).then((res) => res.data);
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete<T>(url, config).then((res) => res.data);
  }
}
