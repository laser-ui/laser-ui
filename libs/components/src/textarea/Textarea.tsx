import type { TextareaProps } from './types';

import { useForkRef } from '@laser-ui/hooks';
import { isFunction, isNumber, isUndefined } from 'lodash';
import { forwardRef, useEffect, useRef } from 'react';

import { CLASSES } from './vars';
import { useComponentProps, useControlled, useDesign, useScopedProps, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref): React.ReactElement | null => {
  const {
    styleOverrides,
    styleProvider,
    formControl,
    model,
    defaultModel,
    autoRows = false,
    resizable = true,
    showCount = false,
    size: sizeProp,
    onModelChange,

    ...restProps
  } = useComponentProps('Textarea', props);

  const styled = useStyled(CLASSES, { textarea: styleProvider?.textarea }, styleOverrides);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const combineTextareaRef = useForkRef(textareaRef, ref);

  const [value, changeValue] = useControlled<string>(defaultModel ?? '', model, onModelChange, undefined, formControl?.control);

  const { size, disabled } = useScopedProps({ size: sizeProp, disabled: restProps.disabled || formControl?.control.disabled });

  useEffect(() => {
    const textareaEl = textareaRef.current;
    if (textareaEl && autoRows !== false) {
      const cssText = textareaEl.style.cssText;
      const rows = textareaEl.rows;

      if (autoRows === true) {
        textareaEl.style.cssText = cssText + 'overflow:hidden;height:0px;min-height:unset;';
        const height = textareaEl.scrollHeight + (textareaEl.offsetHeight - textareaEl.clientHeight);
        textareaEl.style.cssText = cssText;
        textareaEl.style.height = height + 'px';
      } else {
        textareaEl.style.cssText = cssText + 'overflow:hidden;height:0px;padding:0px;min-height:unset;';
        const rowsHeight = textareaEl.scrollHeight + (textareaEl.offsetHeight - textareaEl.clientHeight);
        textareaEl.rows = 1;
        textareaEl.style.cssText = cssText + 'overflow:hidden;padding:0px;height:unset;min-height:unset;';
        const rowHeight = textareaEl.clientHeight;
        let n = Math.round(rowsHeight / rowHeight);

        if (isNumber(autoRows.minRows) && n < autoRows.minRows) {
          n = autoRows.minRows;
        }
        if (isNumber(autoRows.maxRows) && n > autoRows.maxRows) {
          n = autoRows.maxRows;
        }
        textareaEl.rows = n;
        textareaEl.style.cssText = cssText + 'height:unset;min-height:unset;';
      }

      return () => {
        textareaEl.style.cssText = cssText;
        textareaEl.rows = rows;
      };
    }
  });

  const designProps = useDesign({ form: formControl });

  return (
    <>
      <textarea
        {...restProps}
        {...mergeCS(styled('textarea', `textarea--${size}`), {
          className: restProps.className,
          style: {
            ...restProps.style,
            resize: resizable && autoRows === false ? undefined : 'none',
          },
        })}
        {...designProps}
        ref={combineTextareaRef}
        value={value}
        disabled={disabled}
        onChange={(e) => {
          restProps.onChange?.(e);

          changeValue(e.currentTarget.value);
        }}
      />
      {showCount !== false && (
        <div {...styled('textarea__count')}>
          {isFunction(showCount)
            ? showCount(value.length)
            : isUndefined(restProps.maxLength)
              ? value.length
              : `${value.length} / ${restProps.maxLength}`}
        </div>
      )}
    </>
  );
});
