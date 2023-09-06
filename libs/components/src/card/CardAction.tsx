import type { CardActionProps } from './types';

import { forwardRef } from 'react';

import { CLASSES } from './vars';
import { useComponentProps, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export const CardAction = forwardRef<HTMLDivElement, CardActionProps>((props, ref): JSX.Element | null => {
  const {
    styleOverrides,
    styleProvider,
    children,
    disabled = false,

    ...restProps
  } = useComponentProps('CardAction', props);

  const styled = useStyled(CLASSES, { card: styleProvider?.card }, styleOverrides);

  return (
    <div
      {...restProps}
      {...mergeCS(
        styled('card__action', {
          'card__action.is-disabled': disabled,
        }),
        {
          className: restProps.className,
          style: restProps.style,
        },
      )}
      ref={ref}
      role={restProps['role'] ?? 'button'}
      tabIndex={restProps['tabIndex'] ?? (disabled ? -1 : 0)}
    >
      {children}
    </div>
  );
});
