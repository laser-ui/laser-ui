import type { BaseInputProps } from './types';

import { isString } from 'lodash';
import { forwardRef, useState } from 'react';

export const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>((props, ref) => {
  const {
    value,
    onValueChange,

    ...restProps
  } = props;

  const [composing, setComposing] = useState<string>();

  return (
    <input
      {...restProps}
      ref={ref}
      value={isString(composing) ? composing : value}
      onCompositionStart={(e) => {
        restProps.onCompositionStart?.(e);

        setComposing(e.currentTarget.value);
      }}
      onCompositionEnd={(e) => {
        restProps.onCompositionEnd?.(e);

        setComposing(undefined);
        onValueChange(e.currentTarget.value);
      }}
      onChange={(e) => {
        restProps.onChange?.(e);

        if (isString(composing)) {
          setComposing(e.currentTarget.value);
        } else {
          onValueChange(e.currentTarget.value);
        }
      }}
    />
  );
});
