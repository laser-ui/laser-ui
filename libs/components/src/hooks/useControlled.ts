import type { AbstractControl } from '../form';
import type { DraftFunction } from '@laser-ui/hooks/useImmer';

import { freeze, produce } from 'immer';
import { isFunction, isUndefined } from 'lodash';
import { useRef, useState } from 'react';

export function useControlled<T, S = T>(
  initialValue: T | (() => T),
  value?: T,
  onChange?: (value: S) => void,
  deepCompare?: (previous: T, current: S) => boolean,
  formControl?: AbstractControl,
): [T, (value: S | DraftFunction<S>) => S] {
  const [_value, setValue] = useState(initialValue);
  const valueRef = useRef<T>(_value);
  valueRef.current = formControl ? formControl.value : !isUndefined(value) ? value : _value;

  return [
    valueRef.current,
    (value: any) => {
      const newValue = isFunction(value) ? produce(valueRef.current, value) : freeze(value);
      const reRender = deepCompare ? !deepCompare(valueRef.current, newValue) : !Object.is(valueRef.current, newValue);
      if (reRender) {
        setValue(newValue);
        onChange?.(newValue);

        if (formControl) {
          formControl.markAsDirty(true);
          formControl.setValue(newValue);
          (formControl.root as any)._emitChange?.(formControl);
        }
      }
      return newValue;
    },
  ];
}
