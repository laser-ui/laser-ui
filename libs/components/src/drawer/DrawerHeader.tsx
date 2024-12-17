import type { DrawerHeaderProps } from './types';
import type { ButtonProps } from '../button';

import CloseOutlined from '@material-design-icons/svg/outlined/close.svg?react';
import { has } from 'lodash';
import { Fragment, use } from 'react';

import { CLASSES, DrawerContext } from './vars';
import { Button } from '../button';
import { useComponentProps, useControlled, useStyled, useTranslation } from '../hooks';
import { Icon } from '../icon';
import { mergeCS } from '../utils';

export function DrawerHeader(props: DrawerHeaderProps): React.ReactElement | null {
  const {
    styleOverrides,
    styleProvider,
    children,
    actions = ['close'],
    closeProps: closePropsProp,
    onCloseClick,

    ...restProps
  } = useComponentProps('DrawerHeader', props);

  const styled = useStyled(CLASSES, { drawer: styleProvider?.drawer }, styleOverrides);

  const { t } = useTranslation();

  const drawerContext = use(DrawerContext);

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
            drawerContext?.onClose();
          }
        });
      } else if (shouldClose !== false) {
        drawerContext?.onClose();
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
      <div {...styled('drawer__header-title')} id={drawerContext?.id}>
        {children}
      </div>
      <div {...styled('drawer__header-actions')}>
        {actions.map((node, index) => {
          const { id, action } = (has(node, ['id', 'action']) ? node : { id: index, action: node }) as {
            id: React.Key;
            action: React.ReactNode;
          };
          return (
            <Fragment key={id}>
              {action === 'close' ? (
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
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
