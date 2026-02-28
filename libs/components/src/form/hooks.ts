/* eslint-disable @typescript-eslint/no-empty-function */
import type { AbstractControl } from './model/abstract-control';
import type { FormGroup } from './model/form-group';

import { useEventCallback } from '@laser-ui/hooks';
import { useEffect, useRef, useState } from 'react';

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
  const emitRender = useRef(() => {});

  const [origin, setOrigin] = useState(() => {
    const form = initForm();
    form.setEmitRender(emitRender);
    return form;
  });
  const [form, setForm] = useState(origin);

  const updateForm = useEventCallback((newForm?: FormGroup) => {
    if (newForm) {
      newForm.setEmitRender(emitRender);
      setOrigin(newForm);
      setForm(createUltimateProxy(newForm));
    } else {
      setForm(createUltimateProxy(origin));
    }
  });

  useEffect(() => {
    emitRender.current = () => {
      updateForm();

      emitRender.current = () => {};
    };
  });

  return [form, updateForm] as const;
}
