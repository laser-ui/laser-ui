import type { AbstractParserOptions } from './parser';

export abstract class AbstractStorage<K, V> {
  abstract parser?: AbstractParserOptions<V>;

  abstract getItem(key: K): V | null;

  abstract setItem(key: K, value: V): void;

  abstract removeItem(key: K): void;

  abstract clear(): void;
}
