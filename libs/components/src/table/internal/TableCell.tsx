import type { Styled } from '../../hooks/useStyled';

import { isNumber, isUndefined } from 'lodash';
import { createElement, useContext, useEffect, useRef } from 'react';

import { mergeCS } from '../../utils';
import { TableContext, type CLASSES } from '../vars';

const ZINDEX_CONFIG = {
  top: 5,
  right: 2,
  bottom: 5,
  left: 2,
};

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  namespace: string;
  styled: Styled<typeof CLASSES>;
  tag: 'th' | 'td';
  width: number | string | undefined;
  align: 'left' | 'right' | 'center';
  fixed:
    | {
        top?: number | string;
        right?: number | string;
        bottom?: number | string;
        left?: number | string;
      }
    | undefined;
  ellipsis: boolean;
}

export function TableCell(props: TableCellProps): JSX.Element | null {
  const {
    children,
    namespace,
    styled,
    tag,
    width,
    align,
    fixed,
    ellipsis: ellipsisProp,

    ...restProps
  } = props;

  const tableContext = useContext(TableContext);

  const cellRef = useRef<HTMLTableCellElement>(null);

  const ellipsis = ellipsisProp || tableContext.ellipsis;

  let fixedLeft = false;
  let fixedRight = false;
  let fixedStyle = {};
  if (fixed) {
    fixedStyle = {
      ...fixed,
      position: 'sticky',
      zIndex:
        (tag === 'th' ? 1 : 0) +
        Object.keys(fixed).reduce((previous, current) => previous + ZINDEX_CONFIG[current as keyof typeof ZINDEX_CONFIG], 0),
    };

    if ('left' in fixed) {
      fixedLeft = true;
    }
    if ('right' in fixed) {
      fixedRight = true;
    }
  }

  useEffect(() => {
    if (cellRef.current && cellRef.current.parentElement) {
      let showShadow = false;
      if (fixedLeft && tableContext.fixed.includes('left')) {
        const elsL = cellRef.current.parentElement.querySelectorAll(`.${namespace}-table__cell--fixed-left`);
        if (elsL.item(elsL.length - 1) === cellRef.current) {
          showShadow = true;
        }
      }

      if (fixedRight && tableContext.fixed.includes('right')) {
        const elsR = cellRef.current.parentElement.querySelectorAll(`.${namespace}-table__cell--fixed-right`);
        if (elsR.item(0) === cellRef.current) {
          showShadow = true;
        }
      }

      cellRef.current.classList.toggle(`${namespace}-table__cell--fixed-shadow`, showShadow);
    }
  });

  return createElement(
    tag,
    {
      ...restProps,
      ...mergeCS(
        styled('table__cell', `table__cell--${align}`, {
          'table__cell--fixed-left': fixedLeft,
          'table__cell--fixed-right': fixedRight,
          'table__cell--ellipsis': ellipsis,
        }),
        {
          className: restProps.className,
          style: {
            ...restProps.style,
            ...fixedStyle,
            width: isUndefined(width) ? undefined : width,
          },
        },
      ),
      ref: cellRef,
    },
    <div
      {...mergeCS(styled('table__cell-content'), {
        style: {
          width: isUndefined(width) ? undefined : `calc(${width}${isNumber(width) ? 'px' : ''} - var(--padding-size) * 2)`,
        },
      })}
    >
      {children}
    </div>,
  );
}
