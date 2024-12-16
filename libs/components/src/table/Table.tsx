import type { TableContextData, TableProps } from './types';

import { useAsync, useIsomorphicLayoutEffect, useResize } from '@laser-ui/hooks';
import { isSimpleArrayEqual } from '@laser-ui/utils';
import { useMemo, useRef, useState } from 'react';

import { TableEmpty } from './TableEmpty';
import { TableExpand } from './TableExpand';
import { TableFilter } from './TableFilter';
import { TableTd } from './TableTd';
import { TableTh } from './TableTh';
import { TableThAction } from './TableThAction';
import { CLASSES, TableContext } from './vars';
import { useComponentProps, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export const Table: {
  (props: TableProps): React.ReactElement | null;
  Th: typeof TableTh;
  ThAction: typeof TableThAction;
  Td: typeof TableTd;
  Filter: typeof TableFilter;
  Empty: typeof TableEmpty;
  Expand: typeof TableExpand;
} = (props) => {
  const {
    children,
    styleOverrides,
    styleProvider,
    border = false,
    ellipsis = false,

    ...restProps
  } = useComponentProps('Table', props);

  const styled = useStyled(CLASSES, { table: styleProvider?.table }, styleOverrides);

  const async = useAsync();

  const divRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const clearTid = useRef(() => {});

  const [fixed, setFixed] = useState<('left' | 'right')[]>([]);

  const handleFixed = () => {
    if (divRef.current) {
      const scrollLeft = divRef.current.scrollLeft;
      const maxScrollLeft = divRef.current.scrollWidth - divRef.current.clientWidth;
      let newFixed: ('left' | 'right')[] = [];
      if (maxScrollLeft === 0) {
        newFixed = [];
      } else if (scrollLeft === 0) {
        newFixed = ['right'];
      } else if (Math.ceil(scrollLeft) >= maxScrollLeft) {
        newFixed = ['left'];
      } else {
        newFixed = ['left', 'right'];
      }

      if (!isSimpleArrayEqual(newFixed, fixed)) {
        setFixed(newFixed);
      }
    }
  };

  useIsomorphicLayoutEffect(() => {
    handleFixed();
  }, []);

  useResize(divRef, () => {
    clearTid.current();
    clearTid.current = async.setTimeout(() => {
      handleFixed();
    }, 100);
  });

  const context = useMemo<TableContextData>(() => ({ fixed, ellipsis }), [ellipsis, fixed]);

  return (
    <div
      {...restProps}
      {...mergeCS(
        styled('table', {
          'table--border': border,
        }),
        {
          className: restProps.className,
          style: restProps.style,
        },
      )}
      ref={divRef}
      onScroll={(e) => {
        restProps.onScroll?.(e);

        handleFixed();
      }}
    >
      <TableContext.Provider value={context}>{children}</TableContext.Provider>
    </div>
  );
};

Table.Th = TableTh;
Table.ThAction = TableThAction;
Table.Td = TableTd;
Table.Filter = TableFilter;
Table.Empty = TableEmpty;
Table.Expand = TableExpand;
