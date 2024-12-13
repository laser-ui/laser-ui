import type { FabButtonProps } from './types';

import { setRef } from '@laser-ui/utils';
import AddOutlined from '@material-design-icons/svg/outlined/add.svg?react';
import { use } from 'react';

import { BUTTON_CLASSES, FabBacktopContext, FabContext, FabListContext } from './vars';
import { useComponentProps, useStyled } from '../hooks';
import { Icon } from '../icon';
import { CircularProgress } from '../internal/circular-progress';
import { mergeCS } from '../utils';

export function FabButton(props: FabButtonProps): React.ReactElement | null {
  const {
    ref,
    children,
    styleOverrides,
    styleProvider,
    pattern = 'primary',
    theme = 'primary',
    loading = false,
    shape,

    ...restProps
  } = useComponentProps('FabButton', props);

  const styled = useStyled(BUTTON_CLASSES, { 'fab-button': styleProvider?.['fab-button'] }, styleOverrides);

  const fabContext = use(FabContext);
  const fabListContext = use(FabListContext);
  const fabBacktopContext = use(FabBacktopContext);

  return (
    <button
      {...restProps}
      {...mergeCS(
        styled('fab-button', `fab-button.t-${theme}`, `fab-button--${pattern}`, {
          'fab-button.is-expand': fabContext && fabContext.expand,
          'fab-button.is-loading': loading,
          'fab-button--in-actions': fabListContext,
          [`fab-button--${shape}`]: shape,
        }),
        {
          className: restProps.className,
          style: {
            ...restProps.style,
            ...(fabListContext ? { animationDelay: `${fabListContext.index * 33}ms` } : undefined),
            ...(fabBacktopContext && fabBacktopContext.leaved ? { display: 'none' } : undefined),
          },
        },
      )}
      ref={(instance) => {
        const ret = setRef(ref, instance);
        if (fabBacktopContext) {
          fabBacktopContext.ref(instance);
        }
        return () => {
          ret();
          if (fabBacktopContext) {
            fabBacktopContext.ref(null);
          }
        };
      }}
      type={restProps.type ?? 'button'}
      onClick={(e) => {
        restProps.onClick?.(e);

        if (fabContext) {
          fabContext.onClick();
        }
        if (fabListContext) {
          fabListContext.onClick();
        }
        if (fabBacktopContext) {
          fabBacktopContext.onClick();
        }
      }}
    >
      <Icon {...styled('fab-button__icon')}>
        <AddOutlined />
      </Icon>
      <div {...styled('fab-button__content')}>
        {loading ? (
          <Icon>
            <CircularProgress />
          </Icon>
        ) : (
          children
        )}
      </div>
    </button>
  );
}
