import type { BreadcrumbItem, BreadcrumbProps } from './types';

import { Fragment } from 'react';

import { CLASSES } from './vars';
import { useComponentProps, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export function Breadcrumb<ID extends React.Key, T extends BreadcrumbItem<ID>>(props: BreadcrumbProps<ID, T>): JSX.Element | null {
  const {
    styleOverrides,
    styleProvider,
    list,
    separator,
    onClick,

    ...restProps
  } = useComponentProps('Breadcrumb', props);

  const styled = useStyled(CLASSES, { breadcrumb: styleProvider?.breadcrumb }, styleOverrides);

  return (
    <nav
      {...restProps}
      {...mergeCS(styled('breadcrumb'), {
        className: restProps.className,
        style: restProps.style,
      })}
    >
      <ol {...styled('breadcrumb__list')}>
        {list.map((item, index) => (
          <Fragment key={item.id}>
            <li
              {...styled('breadcrumb__item', {
                'breadcrumb__item--link': item.link,
                'breadcrumb__item--last': index === list.length - 1,
              })}
              onClick={() => {
                onClick?.(item.id, item);
              }}
            >
              {item.title}
            </li>
            {index !== list.length - 1 && (
              <li {...styled('breadcrumb__separator')} aria-hidden>
                {item.separator ?? separator ?? '/'}
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
