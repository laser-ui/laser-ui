import type { CheckboxGroupItem, CheckboxGroupProps } from './types';

import { useComponentProps, useControlled, useScopedProps } from '../hooks';

export function CheckboxGroup<V extends React.Key, T extends CheckboxGroupItem<V>>(
  props: CheckboxGroupProps<V, T>,
): React.ReactElement | null {
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

  return children(
    { role: 'group' },
    (option) => ({
      children: option.label,
      model: values.includes(option.value),
      disabled: option.disabled || disabled,
      inputProps: formControl?.inputAria,
      onModelChange: (checked) => {
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
      },
    }),
    list,
  );
}
