import type { FormProps } from './types';

import { isUndefined } from 'lodash';
import { useEffect, useRef } from 'react';

import { FormItem } from './FormItem';
import { CLASSES, FormContext } from './vars';
import { ConfigProvider } from '../config-provider';
import { useComponentProps, useScopedProps, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export const Form: {
  (props: FormProps): React.ReactElement | null;
  Item: typeof FormItem;
} = (props) => {
  const {
    children,
    styleOverrides,
    styleProvider,
    vertical = false,
    labelWidth,
    labelWrap = false,
    labelColon,
    requiredType = 'required',
    feedbackIcon = false,
    size: sizeProp,

    ...restProps
  } = useComponentProps('Form', props);

  const styled = useStyled(CLASSES, { form: styleProvider?.form }, styleOverrides);

  const formRef = useRef<HTMLFormElement>(null);

  const { size } = useScopedProps({ size: sizeProp });

  useEffect(() => {
    if (formRef.current) {
      let maxWidth = 0;
      formRef.current.querySelectorAll('[data-l-form-label]').forEach((el) => {
        maxWidth = Math.max((el as HTMLElement).offsetWidth, maxWidth);
      });
      formRef.current.style.setProperty('--label-width', `${maxWidth}px`);
    }
  });

  return (
    <form
      {...restProps}
      {...mergeCS(styled('form', `form--${size}`), {
        className: restProps.className,
        style: restProps.style,
      })}
      ref={(instance) => {
        formRef.current = instance;
        return () => {
          formRef.current = null;
        };
      }}
      onSubmit={(e) => {
        restProps.onSubmit?.(e);

        e.preventDefault();
        e.stopPropagation();
      }}
      onReset={(e) => {
        restProps.onReset?.(e);

        e.preventDefault();
      }}
    >
      <ConfigProvider context={{ componentSize: size }}>
        <FormContext
          value={{
            vertical,
            labelWidth: labelWidth ?? (vertical ? undefined : 'auto'),
            labelWrap: isUndefined(labelWidth) ? false : labelWrap,
            labelColon: labelColon ?? !vertical,
            requiredType,
            feedbackIcon,
          }}
        >
          <div {...styled('form__row')}>{children}</div>
        </FormContext>
      </ConfigProvider>
    </form>
  );
};

Form.Item = FormItem;
