import type { CheckboxGroupItem, CheckboxGroupProps } from './types';

import { cloneElement } from 'react';

import { Checkbox } from './Checkbox';
import { useComponentProps, useControlled, useScopedProps } from '../hooks';

export function CheckboxGroup<V extends React.Key, T extends CheckboxGroupItem<V>>(props: CheckboxGroupProps<V, T>): JSX.Element | null {
  const {
    children,
    formControl,
    list,
    model,
    defaultModel,
    disabled: disabledProp = false,
    onModelChange,
  } = useComponentProps('CheckboxGroup', props);

  const [values, changeValues] = useControlled<V[]>(
    defaultModel ?? [],
    model,
    (vals) => {
      if (onModelChange) {
        onModelChange(
          vals,
          vals.map((val) => list.find((o) => o.value === val) as T),
        );
      }
    },
    undefined,
    formControl?.control,
  );

  const { disabled } = useScopedProps({ disabled: disabledProp || formControl?.control.disabled });

  const childrenNode = children(
    list.map((option) => (
      <Checkbox
        key={option.value}
        model={values.includes(option.value)}
        disabled={option.disabled || disabled}
        inputRender={(el) => cloneElement(el, formControl?.inputAria)}
        onModelChange={(checked) => {
          changeValues((draft) => {
            if (checked) {
              draft.push(option.value);
            } else {
              draft.splice(
                draft.findIndex((v) => v === option.value),
                1,
              );
            }
          });
        }}
      >
        {option.label}
      </Checkbox>
    )),
  );

  return cloneElement(childrenNode, { role: childrenNode.props.role ?? 'group' });
}
