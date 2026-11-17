/* eslint-disable @typescript-eslint/no-empty-function */
import type { AbstractControl } from './model/abstract-control';
import type { FormGroup } from './model/form-group';

import { useEventCallback } from '@laser-ui/hooks';
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';

function createUltimateProxy<T extends object>(instance: T) {
  return new Proxy(instance, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      return typeof value === 'function' ? value.bind(target) : value;
    },

    set(target, prop, value, receiver) {
      return Reflect.set(target, prop, value, receiver);
    },

    has(target, prop) {
      return Reflect.has(target, prop);
    },

    deleteProperty(target, prop) {
      return Reflect.deleteProperty(target, prop);
    },

    ownKeys(target) {
      return Reflect.ownKeys(target);
    },

    getOwnPropertyDescriptor(target, prop) {
      return Reflect.getOwnPropertyDescriptor(target, prop);
    },

    defineProperty(target, prop, descriptor) {
      return Reflect.defineProperty(target, prop, descriptor);
    },

    getPrototypeOf(target) {
      return Reflect.getPrototypeOf(target);
    },

    setPrototypeOf(target, proto) {
      return Reflect.setPrototypeOf(target, proto);
    },

    isExtensible(target) {
      return Reflect.isExtensible(target);
    },

    preventExtensions(target) {
      return Reflect.preventExtensions(target);
    },
  });
}

export function useForm<T extends { [K in keyof T]: AbstractControl } = any>(initForm: () => FormGroup<T>) {
  // Form controls are external mutable stores: every mutation bumps `version` and notifies React,
  // and React collapses multiple notifications in the same batch into one render.
  const [store] = useState(() => {
    const store = {
      version: 0,
      listener: () => {},
      emitRender: { current: () => {} },
    };
    store.emitRender.current = () => {
      store.version += 1;
      store.listener();
    };
    return store;
  });

  const [origin, setOrigin] = useState(() => {
    const form = initForm();
    form.setEmitRender(store.emitRender);
    return form;
  });

  const version = useSyncExternalStore(
    useCallback(
      (listener: () => void) => {
        store.listener = listener;
        return () => {
          store.listener = () => {};
        };
      },
      [store],
    ),
    () => store.version,
    () => store.version,
  );

  // Derive a new proxy instance on every render that contains form changes, so the identity
  // of `form` reflects form changes as before. `version` is an intentional dependency.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const form = useMemo(() => createUltimateProxy(origin), [origin, version]);

  const updateForm = useEventCallback((newForm?: FormGroup) => {
    if (newForm) {
      newForm.setEmitRender(store.emitRender);
      setOrigin(newForm);
    } else {
      store.emitRender.current();
    }
  });

  return [form, updateForm] as const;
}
