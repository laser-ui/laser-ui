import type { Token } from '../auth';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface HttpConfigs {
  mock?: (config: AxiosRequestConfig) => Promise<AxiosResponse>;
  baseURL?: string;
  transformURL: (url: string) => string;
  token?: Token;
}

export const CONFIGS: HttpConfigs = {
  transformURL: (url: string) => {
    return url;
  },
};

export function config(configs: Partial<HttpConfigs>) {
  Object.keys(configs).forEach((key) => {
    (CONFIGS as any)[key] = (configs as any)[key];
  });
}
