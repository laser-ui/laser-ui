import type { FabButtonProps } from './types';

import AddOutlined from '@material-design-icons/svg/outlined/add.svg?react';
import { forwardRef } from 'react';

import { BUTTON_CLASSES } from './vars';
import { useComponentProps, useStyled } from '../hooks';
import { Icon } from '../icon';
import { CircularProgress } from '../internal/circular-progress';
import { mergeCS } from '../utils';

export const FabButton = forwardRef<HTMLButtonElement, FabButtonProps>((props, ref): JSX.Element | null => {
  const {
    children,
    styleOverrides,
    styleProvider,
    pattern = 'primary',
    theme = 'primary',
    loading = false,
    shape,

    _expand = false,
    _action = false,

    ...restProps
  } = useComponentProps('FabButton', props as FabButtonProps & { _expand?: boolean; _action?: boolean });

  const styled = useStyled(BUTTON_CLASSES, { 'fab-button': styleProvider?.['fab-button'] }, styleOverrides);

  return (
    <button
      {...restProps}
      {...mergeCS(
        styled('fab-button', `fab-button.t-${theme}`, `fab-button--${pattern}`, {
          'fab-button.is-expand': _expand,
          'fab-button.is-loading': loading,
          'fab-button--in-actions': _action,
          [`fab-button--${shape}`]: shape,
        }),
        {
          className: restProps.className,
          style: restProps.style,
        },
      )}
      ref={ref}
      type={restProps.type ?? 'button'}
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
});
