import type { DrawerFooterProps } from './types';
import type { ButtonProps } from '../button';

import { has } from 'lodash';
import { Fragment, use } from 'react';

import { CLASSES, DrawerContext } from './vars';
import { Button } from '../button';
import { useComponentProps, useControlled, useStyled, useTranslation } from '../hooks';
import { mergeCS } from '../utils';

export function DrawerFooter(props: DrawerFooterProps): React.ReactElement | null {
  const {
    styleOverrides,
    styleProvider,
    align = 'right',
    actions = ['cancel', 'ok'],
    cancelProps: cancelPropsProp,
    okProps: okPropsProp,
    onCancelClick,
    onOkClick,

    ...restProps
  } = useComponentProps('DrawerFooter', props);

  const styled = useStyled(CLASSES, { drawer: styleProvider?.drawer }, styleOverrides);

  const { t } = useTranslation();

  const drawerContext = use(DrawerContext);

  const [cancelLoading, changeCancelLoading] = useControlled<boolean>(false, cancelPropsProp?.loading);
  const [okLoading, changeOkLoading] = useControlled<boolean>(false, okPropsProp?.loading);

  const cancelProps: ButtonProps = {
    ...cancelPropsProp,
    loading: cancelLoading,
    onClick: () => {
      const shouldClose = onCancelClick?.();
      if (shouldClose instanceof Promise) {
        changeCancelLoading(true);
        shouldClose.then((val) => {
          changeCancelLoading(false);
          if (val !== false) {
            drawerContext?.onClose();
          }
        });
      } else if (shouldClose !== false) {
        drawerContext?.onClose();
      }
    },
  };

  const okProps: ButtonProps = {
    ...okPropsProp,
    loading: okLoading,
    onClick: () => {
      const shouldClose = onOkClick?.();
      if (shouldClose instanceof Promise) {
        changeOkLoading(true);
        shouldClose.then((val) => {
          changeOkLoading(false);
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
      {...mergeCS(styled('drawer__footer', `drawer__footer--${align}`), {
        className: restProps.className,
        style: restProps.style,
      })}
    >
      {actions.map((node, index) => {
        const { id, action } = (has(node, ['id', 'action']) ? node : { id: index, action: node }) as {
          id: React.Key;
          action: React.ReactNode;
        };
        return (
          <Fragment key={id}>
            {action === 'cancel' ? (
              <Button {...cancelProps} pattern={cancelProps.pattern ?? 'secondary'}>
                {cancelProps.children ?? t('Footer', 'Cancel')}
              </Button>
            ) : action === 'ok' ? (
              <Button {...okProps}>{okProps.children ?? t('Footer', 'OK')}</Button>
            ) : (
              action
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
