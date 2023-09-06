import type { TableEmptyProps } from './types';

import { checkNodeExist } from '@laser-ui/utils';
import { isUndefined } from 'lodash';
import { useEffect, useRef } from 'react';

import { CLASSES } from './vars';
import { Empty } from '../empty';
import { useComponentProps, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export function TableEmpty(props: TableEmptyProps): JSX.Element | null {
  const {
    children,
    styleOverrides,
    styleProvider,
    colSpan,

    ...restProps
  } = useComponentProps('TableEmpty', props);

  const styled = useStyled(CLASSES, { table: styleProvider?.table }, styleOverrides);

  const tdRef = useRef<HTMLTableCellElement>(null);

  useEffect(() => {
    if (isUndefined(colSpan) && tdRef.current) {
      let tableEl = tdRef.current.parentElement;
      while (tableEl && tableEl.tagName.toLowerCase() !== 'table') {
        tableEl = tableEl.parentElement;
      }
      if (tableEl) {
        let colSpan = 0;
        const cells = (tableEl as HTMLTableElement).rows.item(0)?.cells;
        if (cells) {
          for (let index = 0; index < cells.length; index++) {
            colSpan += (cells.item(index) as HTMLTableCellElement).colSpan ?? 1;
          }
          tdRef.current.colSpan = colSpan;
        }
      }
    }
  });

  return (
    <tr
      {...restProps}
      {...mergeCS(styled('table__empty'), {
        className: restProps.className,
        style: restProps.style,
      })}
    >
      <td ref={tdRef} colSpan={colSpan}>
        <div {...styled('table__empty-content')}>{checkNodeExist(children) ? children : <Empty image={Empty.SIMPLE_IMG} />}</div>
      </td>
    </tr>
  );
}
