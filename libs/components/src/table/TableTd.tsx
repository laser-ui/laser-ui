import type { TableTdProps } from './types';

import { TableCell } from './internal/TableCell';
import { CLASSES } from './vars';
import { useComponentProps, useNamespace, useStyled } from '../hooks';

export function TableTd(props: TableTdProps): JSX.Element | null {
  const {
    children,
    styleOverrides,
    styleProvider,
    width,
    align = 'left',
    fixed,
    ellipsis = false,

    ...restProps
  } = useComponentProps('TableTd', props);

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { table: styleProvider?.table }, styleOverrides);

  return (
    <TableCell {...restProps} namespace={namespace} styled={styled} tag="td" width={width} align={align} fixed={fixed} ellipsis={ellipsis}>
      <div {...styled('table__cell-text')}>{children}</div>
    </TableCell>
  );
}
