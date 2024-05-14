import type { AbstractParserOptions } from './parser';

import { AbstractStorage } from './abstract-storage';

export const LOCAL_STORAGE_PARSER: AbstractParserOptions<string> = {
  plain: {
    serializer: (value) => value,
    deserializer: (value) => value,
  },
  number: {
    serializer: (value) => String(value),
    deserializer: (value) => Number(value),
  },
  json: {
    serializer: (value) => JSON.stringify(value),
    deserializer: (value) => JSON.parse(value),
  },
};

export class LocalStorageService extends AbstractStorage<string, string> {
  parser = LOCAL_STORAGE_PARSER;

  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
