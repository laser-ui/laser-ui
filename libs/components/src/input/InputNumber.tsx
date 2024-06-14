import type { InputNumberProps } from './types';

import { useAsync, useEvent, useForceUpdate, useForkRef, useRefExtra } from '@laser-ui/hooks';
import { checkNodeExist } from '@laser-ui/utils';
import CancelFilled from '@material-design-icons/svg/filled/cancel.svg?react';
import KeyboardArrowDownOutlined from '@material-design-icons/svg/outlined/keyboard_arrow_down.svg?react';
import KeyboardArrowUpOutlined from '@material-design-icons/svg/outlined/keyboard_arrow_up.svg?react';
import { isNull, isUndefined } from 'lodash';
import { useRef } from 'react';

import { CLASSES } from './vars';
import { BaseInput } from '../base-input';
import { useComponentProps, useControlled, useDesign, useScopedProps, useStyled, useTranslation } from '../hooks';
import { Icon } from '../icon';
import { mergeCS } from '../utils';

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
    inputRef: inputRefProp,
    inputRender,
    onModelChange,
    onClear,

    ...restProps
  } = useComponentProps('InputNumber', props);

  const styled = useStyled(CLASSES, { input: styleProvider?.input }, styleOverrides);

  const async = useAsync();
  const { t } = useTranslation();
  const forceUpdate = useForceUpdate();

  const dataRef = useRef<{
    inputFocused: boolean;
    inputValue?: string;
    clearLoop?: () => void;
    clearTid?: () => void;
  }>({
    inputFocused: false,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const combineInputRef = useForkRef(inputRef, inputRefProp);
  const windowRef = useRefExtra(() => window);

  const [value, _changeValue] = useControlled<number | null>(defaultModel ?? null, model, onModelChange, undefined, formControl?.control);
  const inputValue =
    dataRef.current.inputFocused && !isUndefined(dataRef.current.inputValue)
      ? dataRef.current.inputValue
      : isNull(value)
      ? ''
      : value.toString();
  const changeValue = (val: number | null) => {
    if ((isNull(val) ? '' : val.toString()) !== inputValue) {
      forceUpdate();
    }
    dataRef.current.inputValue = undefined;
    _changeValue(val);
  };

  const { size, disabled } = useScopedProps({ size: sizeProp, disabled: disabledProp || formControl?.control.disabled });

  const getValue = (val: number) =>
    Number(Math.max(min ?? -Infinity, Math.min(max ?? Infinity, val)).toFixed(step.toString().split('.')[1]?.length ?? 0));

  const handleNumberButtonMouseDown = (increase = true) => {
    changeValue(
      getValue(
        (() => {
          let val = inputValue.length > 0 ? Number(inputValue) : null;
          if (isNull(val)) {
            return 0;
          }
          if (integer && !Number.isInteger(val)) {
            val = Math.round(val);
          }
          return increase ? val + step : val - step;
        })(),
      ),
    );

    const loop = (prev: number) => {
      const val = getValue(increase ? prev + step : prev - step);
      changeValue(val);
      dataRef.current.clearLoop = async.setTimeout(() => loop(val), 50);
    };
    dataRef.current.clearTid = async.setTimeout(() => loop(Number(inputValue)), 400);
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

  const inputNode = (
    <BaseInput
      {...styled('input__input')}
      {...formControl?.inputAria}
      ref={combineInputRef}
      value={inputValue}
      max={max}
      min={min}
      step={step}
      type="number"
      placeholder={placeholder}
      disabled={disabled}
      onValueChange={(val) => {
        forceUpdate();
        dataRef.current.inputValue = val;

        if (val.length === 0) {
          changeValue(null);
        } else {
          const num = Number(val);
          if ((isUndefined(max) || num <= max) && (isUndefined(min) || num >= min) && (!integer || Number.isInteger(num))) {
            changeValue(num);
          }
        }
      }}
      onFocus={() => {
        dataRef.current.inputFocused = true;
        dataRef.current.inputValue = undefined;
      }}
      onBlur={() => {
        dataRef.current.inputFocused = false;

        if (inputValue.length === 0) {
          changeValue(null);
        } else {
          let num = Number(inputValue);
          if (!isUndefined(max) && num > max) {
            num = max;
          }
          if (!isUndefined(min) && num < min) {
            num = min;
          }
          if (integer && !Number.isInteger(num)) {
            num = Math.round(num);
          }
          changeValue(num);
        }
      }}
    />
  );

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
      {inputRender ? inputRender(inputNode) : inputNode}
      {clearable && !disabled && (
        <div
          {...mergeCS(styled('input__clear'), { style: { opacity: inputValue.length > 0 ? 1 : 0 } })}
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
