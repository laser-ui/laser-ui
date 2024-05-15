import type { AbstractStorage } from './abstract-storage';
import type { AbstractParserOptions } from './parser';

import { LocalStorageService } from './local-storage';

export interface StorageConfigs {
  service: AbstractStorage<any, any>;
  parser?: AbstractParserOptions<any>;
  default: any;
}

export const CONFIGS: StorageConfigs = {
  service: new LocalStorageService(),
  default: {},
};

export function config(configs: Partial<StorageConfigs>) {
  Object.keys(configs).forEach((key) => {
    (CONFIGS as any)[key] = (configs as any)[key];
  });
}
