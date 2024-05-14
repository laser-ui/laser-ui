import type { AbstractStorage } from './abstract-storage';
import type { AbstractParserOptions } from './parser';

import { LocalStorageService } from './local-storage';

export interface Configs {
  service: AbstractStorage<any, any>;
  parser?: AbstractParserOptions<any>;
}

export const CONFIGS: Configs = {
  service: new LocalStorageService(),
};

export function config(configs: Partial<Configs>) {
  Object.keys(configs).forEach((key) => {
    (CONFIGS as any)[key] = (configs as any)[key];
  });
}
