import type { RadioProps } from './types';
import type { WaveRef } from '../internal/wave';

import { checkNodeExist } from '@laser-ui/utils';
import { use, useRef } from 'react';

import { RadioGroup } from './RadioGroup';
import { CLASSES, RadioGroupContext } from './vars';
import { useComponentProps, useControlled, useDesign, useNamespace, useScopedProps, useStyled } from '../hooks';
import { Wave } from '../internal/wave';
import { mergeCS } from '../utils';

export const Radio: {
  (props: RadioProps): React.ReactElement | null;
  Group: typeof RadioGroup;
} = (props) => {
  const {
    children,
    styleOverrides,
    styleProvider,
    formControl,
    model,
    defaultModel,
    disabled: disabledProp = false,
    inputProps,
    onModelChange,

    ...restProps
  } = useComponentProps('Radio', props);

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { radio: styleProvider?.radio }, styleOverrides);

  const waveRef = useRef<WaveRef>(null);

  const groupContext = use(RadioGroupContext);

  const [checked, changeChecked] = useControlled(defaultModel ?? false, model, onModelChange, undefined, formControl?.control);

  const { disabled } = useScopedProps({ disabled: disabledProp || formControl?.control.disabled });

  const designProps = useDesign({ compose: groupContext?.pattern ? { active: checked, disabled } : undefined });

  return (
    <label
      {...restProps}
      {...mergeCS(
        styled('radio', {
          'radio.is-checked': checked,
          'radio.is-disabled': disabled,
          'radio--button': groupContext?.pattern,
          [`radio--button-${groupContext?.pattern}`]: groupContext?.pattern,
          [`radio--button-${groupContext?.size}`]: groupContext?.size,
        }),
        {
          className: restProps.className,
          style: restProps.style,
        },
      )}
      {...designProps}
      onClick={(e) => {
        restProps.onClick?.(e);

        if (groupContext?.pattern) {
          waveRef.current?.();
        }
      }}
    >
      <Wave ref={waveRef} color={`var(--${namespace}-color-primary)`} />
      <div {...styled('radio__input-wrapper')}>
        <input
          {...inputProps}
          {...styled('radio__input')}
          {...formControl?.inputAria}
          type="radio"
          checked={checked}
          disabled={disabled}
          aria-checked={checked}
          onChange={() => {
            changeChecked(true);
          }}
        />
      </div>
      {checkNodeExist(children) && <div {...styled('radio__label')}>{children}</div>}
    </label>
  );
};

Radio.Group = RadioGroup;
