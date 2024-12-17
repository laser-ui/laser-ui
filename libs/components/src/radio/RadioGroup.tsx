import type { RadioGroupItem, RadioGroupProps } from './types';

import { nth } from 'lodash';
import { useId } from 'react';

import { RadioGroupContext } from './vars';
import { useComponentProps, useControlled, useScopedProps } from '../hooks';

export function RadioGroup<V extends React.Key, T extends RadioGroupItem<V>>(props: RadioGroupProps<V, T>): React.ReactElement | null {
  const {
    children,
    formControl,
    list,
    model,
    defaultModel,
    pattern,
    size: sizeProp,
    name: nameProp,
    disabled: disabledProp = false,
    onModelChange,
  } = useComponentProps('RadioGroup', props);

  const uniqueId = useId();
  const name = nameProp ?? uniqueId;

  const [value, changeValue] = useControlled(
    defaultModel ?? nth(list, 0)?.value ?? null,
    model,
    (val) => {
      if (onModelChange) {
        onModelChange(val as V, list.find((o) => o.value === val) as T);
      }
    },
    undefined,
    formControl?.control,
  );

  const { size, disabled } = useScopedProps({ size: sizeProp, disabled: disabledProp || formControl?.control.disabled });

  return (
    <RadioGroupContext value={{ pattern, size }}>
      {children(
        { role: 'radiogroup' },
        (option) => ({
          children: option.label,
          model: option.value === value,
          disabled: option.disabled || disabled,
          inputProps: {
            name,
            value: option.value,
            ...formControl?.inputAria,
          },
          onModelChange: () => {
            changeValue(option.value);
          },
        }),
        list,
      )}
    </RadioGroupContext>
  );
}
