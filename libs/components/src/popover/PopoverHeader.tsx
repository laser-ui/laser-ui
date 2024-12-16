import type { PopoverHeaderProps } from './types';
import type { ButtonProps } from '../button';

import CloseOutlined from '@material-design-icons/svg/outlined/close.svg?react';
import { has } from 'lodash';
import { Fragment, use } from 'react';

import { CLASSES, PopoverContext } from './vars';
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

    ...restProps
  } = useComponentProps('PopoverHeader', props);

  const styled = useStyled(CLASSES, { popover: styleProvider?.popover }, styleOverrides);

  const { t } = useTranslation();

  const popoverContext = use(PopoverContext);

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
            popoverContext?.onClose();
          }
        });
      } else if (shouldClose !== false) {
        popoverContext?.onClose();
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
      <div {...styled('popover__header-title')} id={popoverContext?.id}>
        {children}
      </div>
      <div {...styled('popover__header-actions')}>
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
