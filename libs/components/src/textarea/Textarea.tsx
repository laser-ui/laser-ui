import type { TextareaProps } from './types';

import { useForkRef } from '@laser-ui/hooks';
import { isFunction, isNumber, isUndefined } from 'lodash';
import { forwardRef, useEffect, useRef } from 'react';

import { CLASSES } from './vars';
import { useComponentProps, useControlled, useDesign, useJSS, useScopedProps, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref): JSX.Element | null => {
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
  const sheet = useJSS<'rows'>();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const combineTextareaRef = useForkRef(textareaRef, ref);

  const [value, changeValue] = useControlled<string>(defaultModel ?? '', model, onModelChange, undefined, formControl?.control);

  const { size, disabled } = useScopedProps({ size: sizeProp, disabled: restProps.disabled || formControl?.control.disabled });

  useEffect(() => {
    if (textareaRef.current) {
      const cssText = textareaRef.current.style.cssText;
      textareaRef.current.value = '';
      textareaRef.current.rows = 1;
      textareaRef.current.style.cssText = cssText + 'box-sizing:content-box;overflow:hidden;height:0px;min-height:unset;';
      const outerSize = textareaRef.current.offsetHeight;
      textareaRef.current.style.cssText = cssText + 'overflow:hidden;height:0px;min-height:unset;padding:0px;';
      const lineHeight = textareaRef.current.scrollHeight;
      textareaRef.current.value = value;
      const n = Math.round(textareaRef.current.scrollHeight / lineHeight);

      if (isNumber(restProps.rows)) {
        textareaRef.current.rows = restProps.rows;
      } else {
        textareaRef.current.removeAttribute('rows');
      }
      textareaRef.current.style.cssText = cssText;

      let height: number | undefined;
      let overflow: 'hidden' | undefined;
      let minHeight: number | undefined;
      let maxHeight: number | undefined;
      if (autoRows !== false) {
        height = n * lineHeight;
        overflow = 'hidden';
        if (autoRows !== true) {
          if (isNumber(autoRows.minRows)) {
            minHeight = autoRows.minRows * lineHeight;
          }
          if (isNumber(autoRows.maxRows)) {
            maxHeight = autoRows.maxRows * lineHeight;
            if (autoRows.maxRows < n) {
              overflow = undefined;
            }
          }
        }
      }
      if (sheet.classes.rows) {
        textareaRef.current.classList.toggle(sheet.classes.rows, false);
      }
      sheet.replaceRule('rows', {
        height: isUndefined(height) ? undefined : height + outerSize,
        overflow: isUndefined(overflow) ? undefined : 'hidden',
        minHeight: isUndefined(minHeight) ? undefined : minHeight + outerSize,
        maxHeight: isUndefined(maxHeight) ? undefined : maxHeight + outerSize,
      });
      textareaRef.current.classList.toggle(sheet.classes.rows, true);
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
