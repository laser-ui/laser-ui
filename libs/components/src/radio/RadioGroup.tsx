import type { RadioGroupItem, RadioGroupProps } from './types';

import { nth } from 'lodash';
import { cloneElement, useId } from 'react';

import { Radio } from './Radio';
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

  const childrenNode = children(
    list.map((option) => (
      <Radio
        {...{ _pattern: pattern, _size: size }}
        key={option.value}
        model={option.value === value}
        disabled={option.disabled || disabled}
        inputRender={(el) =>
          cloneElement(el, {
            ...formControl?.inputAria,
            value: option.value,
            name,
          })
        }
        onModelChange={() => {
          changeValue(option.value);
        }}
      >
        {option.label}
      </Radio>
    )),
  );

  return cloneElement(childrenNode, { role: childrenNode.props.role ?? 'radiogroup' });
}
