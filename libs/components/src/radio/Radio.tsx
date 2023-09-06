import type { RadioProps } from './types';
import type { WaveRef } from '../internal/wave';
import type { Size } from '../types';

import { checkNodeExist } from '@laser-ui/utils';
import { useRef } from 'react';

import { RadioGroup } from './RadioGroup';
import { CLASSES } from './vars';
import { useComponentProps, useControlled, useDesign, useNamespace, useScopedProps, useStyled } from '../hooks';
import { Wave } from '../internal/wave';
import { mergeCS } from '../utils';

export const Radio: {
  (props: RadioProps): JSX.Element | null;
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
    inputRef,
    inputRender,
    onModelChange,

    _pattern,
    _size,

    ...restProps
  } = useComponentProps('Radio', props as RadioProps & { _pattern?: 'outline' | 'fill'; _size: Size });

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { radio: styleProvider?.radio }, styleOverrides);

  const waveRef = useRef<WaveRef>(null);

  const [checked, changeChecked] = useControlled(defaultModel ?? false, model, onModelChange, undefined, formControl?.control);

  const { disabled } = useScopedProps({ disabled: disabledProp || formControl?.control.disabled });

  const designProps = useDesign({ compose: _pattern ? { active: checked, disabled } : undefined });

  const inputNode = (
    <input
      {...styled('radio__input')}
      {...formControl?.inputAria}
      ref={inputRef}
      type="radio"
      checked={checked}
      disabled={disabled}
      aria-checked={checked}
      onChange={() => {
        changeChecked(true);
      }}
    />
  );

  return (
    <label
      {...restProps}
      {...mergeCS(
        styled('radio', {
          'radio.is-checked': checked,
          'radio.is-disabled': disabled,
          'radio--button': _pattern,
          [`radio--button-${_pattern}`]: _pattern,
          [`radio--button-${_size}`]: _size,
        }),
        {
          className: restProps.className,
          style: restProps.style,
        },
      )}
      {...designProps}
      onClick={(e) => {
        restProps.onClick?.(e);

        if (_pattern) {
          waveRef.current?.();
        }
      }}
    >
      <Wave ref={waveRef} color={`var(--${namespace}-color-primary)`} />
      <div {...styled('radio__input-wrapper')}>{inputRender ? inputRender(inputNode) : inputNode}</div>
      {checkNodeExist(children) && <div {...styled('radio__label')}>{children}</div>}
    </label>
  );
};

Radio.Group = RadioGroup;
