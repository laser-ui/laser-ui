import type { AbstractControl } from './model/abstract-control';
import type { FormGroup } from './model/form-group';

import { useEventCallback, useForceUpdate, useIsomorphicLayoutEffect } from '@laser-ui/hooks';
import { isString } from 'lodash';
import { useRef, useState } from 'react';

export function useForm<T extends { [K in keyof T]: AbstractControl } = any>(
  initForm: () => FormGroup<T>,
  deps?: readonly (string | ((form: FormGroup<T>) => any[]))[],
) {
  const forceUpdate = useForceUpdate();

  const emitChange = useEventCallback((control: AbstractControl<any>) => {
    if (deps) {
      let rerender = false;
      let index = -1;
      for (const dep of deps) {
        index += 1;
        if (isString(dep)) {
          if (Object.is(form.get(dep), control)) {
            rerender = true;
            break;
          }
        } else {
          const vals = dep(control.root as any);
          const previousVals = previousDeps.current[index];
          if (!vals.every((val, i) => Object.is(val, previousVals[i]))) {
            rerender = true;
            previousDeps.current[index] = vals;
            break;
          }
          previousDeps.current[index] = vals;
        }
      }

      if (rerender) {
        forceUpdate();
      } else {
        (control as any)._emitChange();
      }
    } else {
      forceUpdate();
    }
  });

  const [form, setForm] = useState(() => {
    const form = initForm();
    (form as any)._emitChange = emitChange;
    return form;
  });
  const previousDeps = useRef<any[]>([]);
  useIsomorphicLayoutEffect(() => {
    if (deps) {
      previousDeps.current = deps.map((dep) => (isString(dep) ? dep : dep(form)));
    }
  }, []);

  const updateForm = useEventCallback((form?: FormGroup) => {
    if (form) {
      (form as any)._emitChange = emitChange;
      setForm(form);
    }
    forceUpdate();
  });

  return [form, updateForm] as const;
}
