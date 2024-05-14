import type { AbstractParserOptions } from './parser';

import { isNull } from 'lodash';
import { useMemo, useSyncExternalStore } from 'react';

import { CONFIGS, config } from './configs';
import { MEMORY_STORAGE_PARSER } from './memory-storage';

class Store {
  private _listeners: (() => void)[] = [];
  private _key: any;

  constructor(key: any) {
    this._key = key;
  }

  subscribe(onStoreChange: () => void) {
    this._listeners = this._listeners.concat([onStoreChange]);
    return () => {
      this._listeners = this._listeners.filter((f) => f !== onStoreChange);
    };
  }

  getSnapshot() {
    return localStorage.getItem(this._key);
  }

  emitChange() {
    for (const listener of this._listeners) {
      listener();
    }
  }
}
const STROES = new Map<any, Store>();

export interface Options<T> {
  defaultValue?: T;
  parser?: keyof AbstractParserOptions<any>;
}
export function useStorage<V>(
  key: string,
  options?: Options<V>,
): {
  readonly value: V;
  set: (value: V | ((prev?: V) => V)) => void;
  remove: () => void;
} {
  const { defaultValue = null, parser = 'plain' } = options ?? {};

  const { serializer, deserializer } = (CONFIGS.parser ?? CONFIGS.service.parser ?? MEMORY_STORAGE_PARSER)[parser] as any;

  const store = useMemo(() => {
    let store = STROES.get(key);
    if (!store) {
      store = new Store(key);
      STROES.set(key, store);
    }
    return {
      subscribe: store.subscribe.bind(store),
      getSnapshot: store.getSnapshot.bind(store),
      getServerSnapshot: store.getSnapshot.bind(store),
      emitChange: store.emitChange.bind(store),
    };
  }, [key]);
  let value: any = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  value = isNull(value) ? defaultValue : deserializer(value);

  return {
    value,
    set: (val) => {
      const originValue = serializer(typeof val === 'function' ? (val as (prev?: V) => V)(value) : val);
      CONFIGS.service.setItem(key, originValue);
      store.emitChange();
    },
    remove: () => {
      CONFIGS.service.removeItem(key);
      store.emitChange();
    },
  };
}

useStorage.config = config;
useStorage.clear = () => {
  localStorage.clear();
  for (const [, store] of STROES) {
    store.emitChange();
  }
};
