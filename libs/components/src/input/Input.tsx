import type { InputProps } from './types';

import { checkNodeExist, setRef } from '@laser-ui/utils';
import CancelFilled from '@material-design-icons/svg/filled/cancel.svg?react';
import VisibilityOutlined from '@material-design-icons/svg/outlined/visibility.svg?react';
import VisibilityOffOutlined from '@material-design-icons/svg/outlined/visibility_off.svg?react';
import { useRef } from 'react';

import { InputNumber } from './InputNumber';
import { CLASSES } from './vars';
import { BaseInput } from '../base-input';
import { useComponentProps, useControlled, useDesign, useScopedProps, useStyled, useTranslation } from '../hooks';
import { Icon } from '../icon';
import { mergeCS } from '../utils';

export const Input: {
  (props: InputProps): React.ReactElement | null;
  Number: typeof InputNumber;
} = (props) => {
  const {
    styleOverrides,
    styleProvider,
    formControl,
    model,
    defaultModel,
    type,
    prefix,
    suffix,
    password: passwordProp,
    defaultPassword,
    clearable,
    placeholder,
    size: sizeProp,
    disabled: disabledProp = false,
    inputProps,
    onModelChange,
    onClear,
    onPasswordChange,

    ...restProps
  } = useComponentProps('Input', props);

  const styled = useStyled(CLASSES, { input: styleProvider?.input }, styleOverrides);

  const { t } = useTranslation();

  const inputRef = useRef<HTMLInputElement>(null);

  const [value, changeValue] = useControlled<string>(defaultModel ?? '', model, onModelChange, undefined, formControl?.control);
  const [password, changePassword] = useControlled<boolean>(defaultPassword ?? true, passwordProp, onPasswordChange);

  const { size, disabled } = useScopedProps({ size: sizeProp, disabled: disabledProp || formControl?.control.disabled });

  const preventBlur: React.MouseEventHandler = (e) => {
    if (document.activeElement === inputRef.current && e.target !== inputRef.current && e.button === 0) {
      e.preventDefault();
    }
  };

  const designProps = useDesign({ compose: { disabled }, form: formControl });

  return (
    <div
      {...restProps}
      {...mergeCS(
        styled('input', `input--${size}`, {
          'input.is-disabled': disabled,
        }),
        {
          className: restProps.className,
          style: restProps.style,
        },
      )}
      {...designProps}
      onMouseDown={(e) => {
        restProps.onMouseDown?.(e);

        preventBlur(e);
      }}
      onMouseUp={(e) => {
        restProps.onMouseUp?.(e);

        preventBlur(e);
      }}
      onClick={(e) => {
        restProps.onClick?.(e);

        inputRef.current?.focus({ preventScroll: true });
      }}
    >
      {checkNodeExist(prefix) && <div {...styled('input__prefix')}>{prefix}</div>}
      <BaseInput
        {...inputProps}
        {...styled('input__input')}
        {...formControl?.inputAria}
        ref={(instance) => {
          inputRef.current = instance;
          const ret = setRef(inputProps?.ref, instance);
          return () => {
            inputRef.current = null;
            ret();
          };
        }}
        value={value}
        type={type === 'password' ? (password ? 'password' : 'text') : type}
        placeholder={placeholder}
        disabled={disabled}
        onValueChange={(val) => {
          changeValue(val);
        }}
      />
      {clearable && !disabled && (
        <div
          {...mergeCS(styled('input__clear'), { style: { opacity: value.length > 0 ? 1 : 0 } })}
          role="button"
          aria-label={t('Clear')}
          onClick={() => {
            changeValue('');
            onClear?.();
          }}
        >
          <Icon>
            <CancelFilled />
          </Icon>
        </div>
      )}
      {type === 'password' && !disabled && (
        <div
          {...styled('input__password')}
          role="button"
          aria-label={t('Input', password ? 'Password is not visible' : 'Password is visible')}
          onClick={() => {
            changePassword((prevPassword) => !prevPassword);
          }}
        >
          {password ? (
            <Icon>
              <VisibilityOffOutlined />
            </Icon>
          ) : (
            <Icon>
              <VisibilityOutlined />
            </Icon>
          )}
        </div>
      )}
      {checkNodeExist(suffix) && <div {...styled('input__suffix')}>{suffix}</div>}
    </div>
  );
};

Input.Number = InputNumber;
