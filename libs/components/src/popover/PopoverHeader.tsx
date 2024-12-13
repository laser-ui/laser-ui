import type { PopoverHeaderProps } from './types';
import type { ButtonProps } from '../button';

import CloseOutlined from '@material-design-icons/svg/outlined/close.svg?react';
import { Children } from 'react';

import { CLASSES } from './vars';
import { Button } from '../button';
import { useComponentProps, useControlled, useStyled, useTranslation } from '../hooks';
import { Icon } from '../icon';
import { mergeCS } from '../utils';

export function PopoverHeader(props: PopoverHeaderProps): React.ReactElement | null {
  const {
    styleOverrides,
    styleProvider,
    children,
    actions = [],
    closeProps: closePropsProp,
    onCloseClick,

    _id,
    _onClose,

    ...restProps
  } = useComponentProps(
    'PopoverHeader',
    props as PopoverHeaderProps & {
      _id: string;
      _onClose: () => void;
    },
  );

  const styled = useStyled(CLASSES, { popover: styleProvider?.popover }, styleOverrides);

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
      {...mergeCS(styled('popover__header'), {
        className: restProps.className,
        style: restProps.style,
      })}
    >
      <div {...styled('popover__header-title')} id={_id}>
        {children}
      </div>
      <div {...styled('popover__header-actions')}>
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
