import type { AlertProps } from './types';

import { checkNodeExist } from '@laser-ui/utils';
import { ReactComponent as CheckCircleOutlined } from '@material-design-icons/svg/outlined/check_circle.svg';
import { ReactComponent as CloseOutlined } from '@material-design-icons/svg/outlined/close.svg';
import { ReactComponent as HighlightOffOutlined } from '@material-design-icons/svg/outlined/highlight_off.svg';
import { ReactComponent as InfoOutlined } from '@material-design-icons/svg/outlined/info.svg';
import { ReactComponent as WarningAmberOutlined } from '@material-design-icons/svg/outlined/warning_amber.svg';
import { isUndefined } from 'lodash';

import { CLASSES } from './vars';
import { useComponentProps, useControlled, useStyled, useTranslation } from '../hooks';
import { Icon } from '../icon';
import { CollapseTransition } from '../internal/transition';
import { mergeCS } from '../utils';
import { TTANSITION_DURING_BASE } from '../vars';

export function Alert(props: AlertProps): JSX.Element | null {
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
      originalSize={{
        height: 'auto',
      }}
      collapsedSize={{
        height: 0,
      }}
      enter={visible}
      during={TTANSITION_DURING_BASE}
      styles={{
        enter: { opacity: 0 },
        entering: {
          transition: ['height', 'padding', 'margin', 'opacity'].map((attr) => `${attr} ${TTANSITION_DURING_BASE}ms ease-out`).join(', '),
        },
        leaving: {
          opacity: 0,
          transition: ['height', 'padding', 'margin', 'opacity'].map((attr) => `${attr} ${TTANSITION_DURING_BASE}ms ease-in`).join(', '),
        },
        leaved: { display: 'none' },
      }}
      destroyWhenLeaved
      afterEnter={() => {
        afterVisibleChange?.(true);
      }}
      afterLeave={() => {
        afterVisibleChange?.(false);
      }}
    >
      {(alertRef, collapseStyle) => (
        <div
          {...restProps}
          {...mergeCS(
            styled('alert', {
              'alert--with-title': hasTitle,
              [`alert--${type}`]: type,
            }),
            {
              className: restProps.className,
              style: {
                ...restProps.style,
                ...collapseStyle,
              },
            },
          )}
          ref={alertRef}
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
      )}
    </CollapseTransition>
  );
}
