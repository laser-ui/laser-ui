import type { ImageActionProps } from './types';

import { forwardRef } from 'react';

import { CLASSES } from './vars';
import { useComponentProps, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export const ImageAction = forwardRef<HTMLButtonElement, ImageActionProps>((props, ref): JSX.Element | null => {
  const {
    children,
    styleOverrides,
    styleProvider,

    ...restProps
  } = useComponentProps('ImageAction', props);

  const styled = useStyled(CLASSES, { image: styleProvider?.image }, styleOverrides);

  return (
    <button
      {...restProps}
      {...mergeCS(styled('image__action'), {
        className: restProps.className,
        style: restProps.style,
      })}
      ref={ref}
      type={restProps['type'] ?? 'button'}
    >
      {children}
    </button>
  );
});
