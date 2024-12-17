import type { AlertProps } from './types';

import { checkNodeExist } from '@laser-ui/utils';
import CheckCircleOutlined from '@material-design-icons/svg/outlined/check_circle.svg?react';
import CloseOutlined from '@material-design-icons/svg/outlined/close.svg?react';
import HighlightOffOutlined from '@material-design-icons/svg/outlined/highlight_off.svg?react';
import InfoOutlined from '@material-design-icons/svg/outlined/info.svg?react';
import WarningAmberOutlined from '@material-design-icons/svg/outlined/warning_amber.svg?react';
import { isUndefined } from 'lodash';

import { CLASSES } from './vars';
import { useComponentProps, useControlled, useStyled, useTranslation } from '../hooks';
import { Icon } from '../icon';
import { CollapseTransition } from '../transition';
import { mergeCS } from '../utils';
import { TTANSITION_DURING_BASE } from '../vars';

export function Alert(props: AlertProps): React.ReactElement | null {
  const {
    children,
    styleOverrides,
    styleProvider,
    visible: visibleProp,
    type,
    title,
    icon,
    closable = false,
    onClose,
    afterVisibleChange,

    ...restProps
  } = useComponentProps('Alert', props);

  const styled = useStyled(CLASSES, { alert: styleProvider?.alert }, styleOverrides);

  const { t } = useTranslation();

  const [visible, changeVisible] = useControlled<boolean>(true, visibleProp, onClose);

  const hasTitle = checkNodeExist(title);

  const closeNode = closable && (
    <button
      {...styled('alert__close')}
      aria-label={t('Close')}
      onClick={() => {
        changeVisible(false);
      }}
    >
      <Icon>
        <CloseOutlined />
      </Icon>
    </button>
  );

  return (
    <CollapseTransition
      height={0}
      enter={visible}
      duration={TTANSITION_DURING_BASE}
      onAfterEnter={() => {
        afterVisibleChange?.(true);
      }}
      onAfterLeave={() => {
        afterVisibleChange?.(false);
      }}
    >
      {(transitionRef, leaved) =>
        leaved ? null : (
          <div
            {...restProps}
            {...mergeCS(
              styled('alert', {
                'alert--with-title': hasTitle,
                [`alert--${type}`]: type,
              }),
              {
                className: restProps.className,
                style: { ...restProps.style },
              },
            )}
            ref={(instance) => {
              transitionRef(instance);
              return () => {
                transitionRef(null);
              };
            }}
            role={restProps.role ?? 'alert'}
          >
            {icon !== false && (!isUndefined(type) || checkNodeExist(icon)) && (
              <div {...styled('alert__icon')}>
                {checkNodeExist(icon) ? (
                  icon
                ) : (
                  <Icon>
                    {type === 'success' ? (
                      <CheckCircleOutlined />
                    ) : type === 'warning' ? (
                      <WarningAmberOutlined />
                    ) : type === 'error' ? (
                      <HighlightOffOutlined />
                    ) : (
                      <InfoOutlined />
                    )}
                  </Icon>
                )}
              </div>
            )}
            <div {...styled('alert__content')}>
              {hasTitle && (
                <div {...styled('alert__header')}>
                  <div {...styled('alert__title')}>{title}</div>
                  {closeNode}
                </div>
              )}
              {checkNodeExist(children) && <div {...styled('alert__message')}>{children}</div>}
              {!hasTitle && closeNode}
            </div>
          </div>
        )
      }
    </CollapseTransition>
  );
}
