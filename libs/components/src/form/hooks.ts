import type { AbstractControl } from './model/abstract-control';
import type { FormGroup } from './model/form-group';

import { useEventCallback, useForceUpdate } from '@laser-ui/hooks';
import { useState } from 'react';

export function useForm<T extends { [K in keyof T]: AbstractControl } = any>(initForm: () => FormGroup<T>) {
  const forceUpdate = useForceUpdate();

  const [form, setForm] = useState(() => {
    const form = initForm();
    (form as any)._emitChange = forceUpdate;
    return form;
  });

  const updateForm = useEventCallback((form?: FormGroup) => {
    if (form) {
      (form as any)._emitChange = forceUpdate;
      setForm(form);
    }
    forceUpdate();
  });

  return [form, updateForm] as const;
}
