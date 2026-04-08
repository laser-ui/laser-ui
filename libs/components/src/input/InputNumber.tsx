import type { InputNumberProps } from './types';

import { useAsync, useEvent, useRefExtra } from '@laser-ui/hooks';
import { checkNodeExist, setRef } from '@laser-ui/utils';
import CancelFilled from '@material-design-icons/svg/filled/cancel.svg?react';
import KeyboardArrowDownOutlined from '@material-design-icons/svg/outlined/keyboard_arrow_down.svg?react';
import KeyboardArrowUpOutlined from '@material-design-icons/svg/outlined/keyboard_arrow_up.svg?react';
import { isNull, isUndefined } from 'lodash';
import { useRef, useState } from 'react';

import { CLASSES } from './vars';
import { BaseInput } from '../base-input';
import { useComponentProps, useControlled, useDesign, useScopedProps, useStyled, useTranslation } from '../hooks';
import { Icon } from '../icon';
import { mergeCS } from '../utils';

function syncValueToPlaceholder(value: number | null, placeholder: string) {
  if (isNull(value)) {
    if (placeholder) {
      return '';
    }
  } else {
    if (value !== Number(placeholder)) {
      return value.toString();
    }
  }
}

export function InputNumber(props: InputNumberProps) {
  const {
    styleOverrides,
    styleProvider,
    formControl,
    model,
    defaultModel,
    max,
    min,
    step = 1,
    integer = false,
    prefix,
    suffix,
    clearable,
    placeholder,
    size: sizeProp,
    numberButton = true,
    disabled: disabledProp = false,
    inputProps,
    onModelChange,
    onClear,

    ...restProps
  } = useComponentProps('InputNumber', props);

  const styled = useStyled(CLASSES, { input: styleProvider?.input }, styleOverrides);

  const async = useAsync();
  const { t } = useTranslation();

  const dataRef = useRef<{
    clearLoop?: () => void;
    clearTid?: () => void;
  }>({});

  const windowRef = useRefExtra(() => window);
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, _changeValue] = useControlled<number | null>(defaultModel ?? null, model, onModelChange, undefined, formControl?.control);
  const [placeholderValue, setPlaceholderValue] = useState(() => (isNull(value) ? '' : value.toString()));
  const newPlaceholderValue = syncValueToPlaceholder(value, placeholderValue);
  if (!isUndefined(newPlaceholderValue)) {
    setPlaceholderValue(newPlaceholderValue);
  }
  const changeValue = (val: number | null) => {
    _changeValue(val);
    setPlaceholderValue(isNull(val) ? '' : val.toString());
  };

  const { size, disabled } = useScopedProps({ size: sizeProp, disabled: disabledProp || formControl?.control.disabled });

  const getValue = (val: number) =>
    Number(Math.max(min ?? -Infinity, Math.min(max ?? Infinity, val)).toFixed(step.toString().split('.')[1]?.length ?? 0));

  const handleNumberButtonMouseDown = (increase = true) => {
    const val = getValue(
      (() => {
        let val = placeholderValue.length > 0 ? Number(placeholderValue) : null;
        if (isNull(val)) {
          return 0;
        }
        if (integer && !Number.isInteger(val)) {
          val = Math.round(val);
        }
        return increase ? val + step : val - step;
      })(),
    );
    changeValue(val);

    const loop = (prev: number) => {
      const val = getValue(increase ? prev + step : prev - step);
      changeValue(val);
      dataRef.current.clearLoop = async.setTimeout(() => loop(val), 50);
    };
    dataRef.current.clearTid = async.setTimeout(() => loop(Number(placeholderValue)), 400);
  };

  const handleNumberButtonMouseUp = () => {
    dataRef.current.clearLoop?.();
    dataRef.current.clearTid?.();
  };

  useEvent(windowRef, 'mouseup', handleNumberButtonMouseUp);

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
          style: {
            ...restProps.style,
            paddingRight: numberButton && !disabled && !checkNodeExist(suffix) ? 0 : undefined,
          },
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
        {...mergeCS(styled('input__input'), {
          className: inputProps?.className,
          style: inputProps?.style,
        })}
        {...formControl?.inputAria}
        ref={(instance) => {
          inputRef.current = instance;
          const ret = setRef(inputProps?.ref, instance);
          return () => {
            inputRef.current = null;
            ret();
          };
        }}
        value={placeholderValue}
        max={max}
        min={min}
        step={step}
        type="number"
        placeholder={placeholder}
        disabled={disabled}
        onValueChange={(val) => {
          setPlaceholderValue(val);
          if (val.length === 0) {
            _changeValue(null);
          } else {
            const num = Number(val);
            if ((isUndefined(max) || num <= max) && (isUndefined(min) || num >= min) && (!integer || Number.isInteger(num))) {
              _changeValue(num);
            }
          }
        }}
        onBlur={(e) => {
          inputProps?.onBlur?.(e);

          let val = value;
          if (placeholderValue.length === 0) {
            val = null;
          } else {
            let num = Number(placeholderValue);
            if (!isUndefined(max) && num > max) {
              num = max;
            }
            if (!isUndefined(min) && num < min) {
              num = min;
            }
            if (integer && !Number.isInteger(num)) {
              num = Math.round(num);
            }
            val = num;
          }
          if (val !== value) {
            changeValue(val);
          }
        }}
      />
      {clearable && !disabled && (
        <div
          {...mergeCS(styled('input__clear'), { style: { opacity: placeholderValue.length > 0 ? 1 : 0 } })}
          role="button"
          aria-label={t('Clear')}
          onClick={() => {
            changeValue(null);
            onClear?.();
          }}
        >
          <Icon>
            <CancelFilled />
          </Icon>
        </div>
      )}
      {numberButton && !disabled && (
        <div {...styled('input__number-container')}>
          <div
            {...styled('input__number')}
            role="button"
            aria-label={t('Input', 'Increase number')}
            onMouseDown={(e) => {
              if (e.button === 0) {
                handleNumberButtonMouseDown();
              }
            }}
            onTouchStart={() => {
              handleNumberButtonMouseDown();
            }}
            onTouchEnd={() => {
              handleNumberButtonMouseUp();
            }}
          >
            <Icon>
              <KeyboardArrowUpOutlined />
            </Icon>
          </div>
          <div
            {...styled('input__number')}
            role="button"
            aria-label={t('Input', 'Decrease number')}
            onMouseDown={(e) => {
              if (e.button === 0) {
                handleNumberButtonMouseDown(false);
              }
            }}
            onTouchStart={() => {
              handleNumberButtonMouseDown(false);
            }}
            onTouchEnd={() => {
              handleNumberButtonMouseUp();
            }}
          >
            <Icon>
              <KeyboardArrowDownOutlined />
            </Icon>
          </div>
        </div>
      )}
      {checkNodeExist(suffix) && <div {...styled('input__suffix')}>{suffix}</div>}
    </div>
  );
}
