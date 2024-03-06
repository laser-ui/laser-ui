import type { AbstractParserOptions } from './parser';

import { isNull } from 'lodash';
import { useMemo, useSyncExternalStore } from 'react';

import { STRING_PARSER } from './parser';
import { STORAGE } from '../../configs/storage';

interface UseStorageMethod<V> {
  set: (value: V) => void;
  remove: () => void;
}

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

export function useStorage<V>(
  key: keyof typeof STORAGE,
  parser: keyof AbstractParserOptions<any> = 'plain',
): { readonly value: V } & UseStorageMethod<V> {
  const { PARSER } = useStorage;

  const { serializer, deserializer } = PARSER[parser] as any;

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
  const value = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);

  return {
    value: isNull(value) ? STORAGE[key] : deserializer(value),
    set: (value) => {
      const originValue = serializer(value);
      localStorage.setItem(key, originValue);
      store.emitChange();
    },
    remove: () => {
      localStorage.removeItem(key);
      store.emitChange();
    },
  };
}

useStorage.PARSER = STRING_PARSER as AbstractParserOptions<any>;
useStorage.clear = () => {
  localStorage.clear();
  for (const [, store] of STROES) {
    store.emitChange();
  }
};
