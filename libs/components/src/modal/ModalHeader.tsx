import type { ModalHeaderProps } from './types';
import type { ButtonProps } from '../button';

import CloseOutlined from '@material-design-icons/svg/outlined/close.svg?react';
import { has } from 'lodash';
import { Fragment, use } from 'react';

import { CLASSES, ModalContext } from './vars';
import { Button } from '../button';
import { useComponentProps, useControlled, useStyled, useTranslation } from '../hooks';
import { Icon } from '../icon';
import { mergeCS } from '../utils';

export function ModalHeader(props: ModalHeaderProps): React.ReactElement | null {
  const {
    styleOverrides,
    styleProvider,
    children,
    actions = ['close'],
    closeProps: closePropsProp,
    onCloseClick,

    ...restProps
  } = useComponentProps('ModalHeader', props);

  const styled = useStyled(CLASSES, { modal: styleProvider?.modal }, styleOverrides);

  const { t } = useTranslation();

  const modalContext = use(ModalContext);

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
            modalContext?.onClose();
          }
        });
      } else if (shouldClose !== false) {
        modalContext?.onClose();
      }
    },
  };

  return (
    <div
      {...restProps}
      {...mergeCS(styled('modal__header'), {
        className: restProps.className,
        style: restProps.style,
      })}
    >
      <div {...styled('modal__header-title')} id={modalContext?.id}>
        {children}
      </div>
      <div {...styled('modal__header-actions')}>
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
