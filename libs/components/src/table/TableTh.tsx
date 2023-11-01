import type { TableThProps } from './types';

import { checkNodeExist } from '@laser-ui/utils';
import { isUndefined } from 'lodash';

import { TableCell } from './internal/TableCell';
import { CLASSES } from './vars';
import { useComponentProps, useControlled, useNamespace, useStyled } from '../hooks';
import { Icon } from '../icon';
import { mergeCS } from '../utils';

export function TableTh(props: TableThProps): JSX.Element | null {
  const {
    children,
    styleOverrides,
    styleProvider,
    width,
    align = 'left',
    fixed,
    sort: sortProp,
    action,
    ellipsis = false,

    ...restProps
  } = useComponentProps('TableTh', props);

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { table: styleProvider?.table }, styleOverrides);

  const [sort, changeSort] = useControlled<'ascend' | 'descend' | null>(
    sortProp?.defaultActive ?? null,
    sortProp?.active,
    sortProp?.onChange,
  );

  return (
    <TableCell
      {...restProps}
      {...mergeCS(styled({ 'table__cell--th-sort': sortProp }), {
        className: restProps.className,
        style: restProps.style,
      })}
      namespace={namespace}
      styled={styled}
      tag="th"
      width={width}
      align={align}
      fixed={fixed}
      ellipsis={ellipsis}
      aria-sort={sort === 'ascend' ? 'ascending' : sort === 'descend' ? 'descending' : undefined}
      onClick={(e) => {
        restProps.onClick?.(e);

        if (sortProp) {
          const sortOptions = sortProp.options ?? [null, 'ascend', 'descend'];
          changeSort((draft) => sortOptions[(sortOptions.findIndex((order) => order === draft) + 1) % sortOptions.length]);
        }
      }}
    >
      <div {...styled('table__cell-text')}>{children}</div>
      {(sortProp || checkNodeExist(action)) && (
        <div {...styled('table__th-actions')} aria-hidden>
          {sortProp && (
            <button {...styled('table__th-action', 'table__th-action--sort')}>
              {(isUndefined(sortProp.options) || sortProp.options.includes('ascend')) && (
                <div
                  {...styled('table__th-sort-icon', {
                    'table__th-sort-icon.is-active': sort === 'ascend',
                  })}
                >
                  <Icon size={12}>
                    <svg viewBox="0 0 1024 1024">
                      <path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z" />
                    </svg>
                  </Icon>
                </div>
              )}
              {(isUndefined(sortProp.options) || sortProp.options.includes('descend')) && (
                <div
                  {...styled('table__th-sort-icon', {
                    'table__th-sort-icon.is-active': sort === 'descend',
                  })}
                >
                  <Icon size={12}>
                    <svg viewBox="0 0 1024 1024">
                      <path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z" />
                    </svg>
                  </Icon>
                </div>
              )}
            </button>
          )}
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {action}
          </div>
        </div>
      )}
    </TableCell>
  );
}
