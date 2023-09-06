import type { DrawerHeaderProps } from './types';
import type { ButtonProps } from '../button';

import { ReactComponent as CloseOutlined } from '@material-design-icons/svg/outlined/close.svg';
import { Children } from 'react';

import { CLASSES } from './vars';
import { Button } from '../button';
import { useComponentProps, useControlled, useStyled, useTranslation } from '../hooks';
import { Icon } from '../icon';
import { mergeCS } from '../utils';

export function DrawerHeader(props: DrawerHeaderProps): JSX.Element | null {
  const {
    styleOverrides,
    styleProvider,
    children,
    actions = ['close'],
    closeProps: closePropsProp,
    onCloseClick,

    _id,
    _onClose,

    ...restProps
  } = useComponentProps(
    'DrawerHeader',
    props as DrawerHeaderProps & {
      _id: string;
      _onClose: () => void;
    },
  );

  const styled = useStyled(CLASSES, { drawer: styleProvider?.drawer }, styleOverrides);

  const { t } = useTranslation();

  const [closeLoading, changeCloseLoading] = useControlled<boolean>(false, closePropsProp?.loading);

  const closeProps: ButtonProps = {
    ...closePropsProp,
    loading: closeLoading,
    onClick: () => {
      const shouldClose = onCloseClick?.();
      if (shouldClose instanceof Promise) {
        changeCloseLoading(true);
        shouldClose.then((val) => {
          changeCloseLoading(false);
          if (val !== false) {
            _onClose?.();
          }
        });
      } else if (shouldClose !== false) {
        _onClose?.();
      }
    },
  };

  return (
    <div
      {...restProps}
      {...mergeCS(styled('drawer__header'), {
        className: restProps.className,
        style: restProps.style,
      })}
    >
      <div {...styled('drawer__header-title')} id={_id}>
        {children}
      </div>
      <div {...styled('drawer__header-actions')}>
        {Children.map(actions, (action) =>
          action === 'close' ? (
            <Button
              {...closeProps}
              aria-label={closeProps['aria-label'] ?? t('Close')}
              pattern={closeProps.pattern ?? 'text'}
              icon={
                closeProps.icon ?? (
                  <Icon>
                    <CloseOutlined />
                  </Icon>
                )
              }
            />
          ) : (
            action
          ),
        )}
      </div>
    </div>
  );
}
