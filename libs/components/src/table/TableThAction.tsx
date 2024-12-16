import type { TableThActionProps } from './types';

import { CLASSES } from './vars';
import { useComponentProps, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export function TableThAction(props: TableThActionProps): React.ReactElement | null {
  const {
    ref,
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
}
