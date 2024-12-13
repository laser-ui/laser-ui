import type { TableThActionProps } from './types';

import { forwardRef } from 'react';

import { CLASSES } from './vars';
import { useComponentProps, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export const TableThAction = forwardRef<HTMLDivElement, TableThActionProps>((props, ref): React.ReactElement | null => {
  const {
    styleOverrides,
    styleProvider,
    children,
    active = false,
    disabled = false,

    ...restProps
  } = useComponentProps('TableThAction', props);

  const styled = useStyled(CLASSES, { table: styleProvider?.table }, styleOverrides);

  return (
    <div
      {...restProps}
      {...mergeCS(
        styled('table__th-action', {
          'table__th-action.is-active': active,
          'table__th-action.is-disabled': disabled,
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
