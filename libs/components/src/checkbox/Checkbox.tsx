import type { CheckboxProps } from './types';

import { checkNodeExist } from '@laser-ui/utils';

import { CheckboxGroup } from './CheckboxGroup';
import { CLASSES } from './vars';
import { useComponentProps, useControlled, useScopedProps, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export const Checkbox: {
  (props: CheckboxProps): React.ReactElement | null;
  Group: typeof CheckboxGroup;
} = (props) => {
  const {
    children,
    styleOverrides,
    styleProvider,
    formControl,
    model,
    defaultModel,
    indeterminate = false,
    disabled: disabledProp = false,
    inputProps,
    onModelChange,

    ...restProps
  } = useComponentProps('Checkbox', props);

  const styled = useStyled(CLASSES, { checkbox: styleProvider?.checkbox }, styleOverrides);

  const [checked, changeChecked] = useControlled(defaultModel ?? false, model, onModelChange, undefined, formControl?.control);

  const { disabled } = useScopedProps({ disabled: disabledProp || formControl?.control.disabled });

  return (
    <label
      {...restProps}
      {...mergeCS(
        styled('checkbox', {
          'checkbox.is-checked': checked,
          'checkbox.is-indeterminate': indeterminate,
          'checkbox.is-disabled': disabled,
        }),
        {
          className: restProps.className,
          style: restProps.style,
        },
      )}
    >
      <div {...styled('checkbox__state-container')}>
        <input
          {...inputProps}
          {...styled('checkbox__input')}
          {...formControl?.inputAria}
          type="checkbox"
          disabled={disabled}
          aria-checked={indeterminate ? 'mixed' : checked}
          onChange={() => {
            changeChecked((draft) => !draft);
          }}
        />
        {indeterminate ? <div {...styled('checkbox__indeterminate')} /> : checked && <div {...styled('checkbox__tick')} />}
      </div>
      {checkNodeExist(children) && <div {...styled('checkbox__label')}>{children}</div>}
    </label>
  );
};

Checkbox.Group = CheckboxGroup;
