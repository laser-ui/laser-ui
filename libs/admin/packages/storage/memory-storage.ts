import type { AbstractParserOptions } from './parser';

import { AbstractStorage } from './abstract-storage';

export const MEMORY_STORAGE_PARSER: AbstractParserOptions<any> = {
  plain: {
    serializer: (value) => value,
    deserializer: (value) => value,
  },
  number: {
    serializer: (value) => value,
    deserializer: (value) => value,
  },
  json: {
    serializer: (value) => value,
    deserializer: (value) => value,
  },
};

const MEMORY = new Map();
export class MemoryStorageService extends AbstractStorage<any, any> {
  parser = MEMORY_STORAGE_PARSER;

  getItem(key: any): any | null {
    return MEMORY.get(key);
  }

  setItem(key: any, value: any): void {
    MEMORY.set(key, value);
  }

  removeItem(key: any): void {
    MEMORY.delete(key);
  }

  clear(): void {
    MEMORY.clear();
  }
}
