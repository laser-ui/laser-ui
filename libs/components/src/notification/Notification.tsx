import type { NotificationProps } from './types';

import { useAsync, useMount } from '@laser-ui/hooks';
import { checkNodeExist } from '@laser-ui/utils';
import CheckCircleOutlined from '@material-design-icons/svg/outlined/check_circle.svg?react';
import CloseOutlined from '@material-design-icons/svg/outlined/close.svg?react';
import HighlightOffOutlined from '@material-design-icons/svg/outlined/highlight_off.svg?react';
import InfoOutlined from '@material-design-icons/svg/outlined/info.svg?react';
import WarningAmberOutlined from '@material-design-icons/svg/outlined/warning_amber.svg?react';
import { isUndefined } from 'lodash';
import { useId, useRef } from 'react';

import { CLASSES, TTANSITION_DURING } from './vars';
import { useComponentProps, useNamespace, useStyled, useTranslation } from '../hooks';
import { Icon } from '../icon';
import { LazyLoading } from '../internal/lazy-loading';
import { Portal } from '../internal/portal';
import { CollapseTransition } from '../transition';
import { mergeCS } from '../utils';

export function Notification(props: NotificationProps): React.ReactElement | null {
  const {
    children,
    styleOverrides,
    styleProvider,
    visible,
    title,
    type,
    placement = 'right-top',
    duration = 9.6,
    icon,
    closable = true,
    escClosable = true,
    skipFirstTransition = true,
    destroyAfterClose = false,
    lazyLoading = true,
    onClose,
    afterVisibleChange,

    ...restProps
  } = useComponentProps('Notification', props);

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { notification: styleProvider?.notification }, styleOverrides);

  const { t } = useTranslation();
  const async = useAsync();

  const notificationRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const clearTid = useRef(() => {});

  const uniqueId = useId();
  const titleId = `${namespace}-notification-title-${uniqueId}`;
  const descriptionId = `${namespace}-notification-content-${uniqueId}`;

  useMount(() => {
    if (duration > 0) {
      clearTid.current = async.setTimeout(() => {
        onClose?.();
      }, duration * 1000);
    }
  });

  return (
    <Portal
      selector={() => {
        const id =
          placement === 'left-top'
            ? `${namespace}-notification-lt-root`
            : placement === 'right-top'
              ? `${namespace}-notification-rt-root`
              : placement === 'left-bottom'
                ? `${namespace}-notification-lb-root`
                : `${namespace}-notification-rb-root`;

        let root = document.getElementById(`${namespace}-notification-root`);
        if (!root) {
          root = document.createElement('div');
          root.id = `${namespace}-notification-root`;
          document.body.appendChild(root);
        }

        let el = document.getElementById(id);
        if (!el) {
          el = document.createElement('div');
          el.id = id;
          root.appendChild(el);
        }
        return el;
      }}
    >
      <CollapseTransition
        height={0}
        enter={visible}
        name={`${namespace}-notification`}
        duration={TTANSITION_DURING}
        skipFirstTransition={skipFirstTransition}
        onAfterEnter={() => {
          afterVisibleChange?.(true);
        }}
        onAfterLeave={() => {
          afterVisibleChange?.(false);
        }}
      >
        {(transitionRef, leaved) => (
          <LazyLoading hidden={leaved} disabled={!lazyLoading}>
            {leaved && destroyAfterClose ? null : (
              <div
                {...restProps}
                {...mergeCS(
                  styled('notification', {
                    [`notification--${type}`]: type,
                  }),
                  {
                    className: restProps.className,
                    style: {
                      ...restProps.style,
                      ...{
                        '--notification-transform':
                          placement === 'left-top' || placement === 'left-bottom' ? 'translate(-100%, 0)' : 'translate(100%, 0)',
                      },
                      ...(leaved ? { display: 'none' } : undefined),
                    },
                  },
                )}
                ref={(instance) => {
                  notificationRef.current = instance;
                  transitionRef(instance);
                  return () => {
                    notificationRef.current = null;
                    transitionRef(null);
                  };
                }}
                tabIndex={restProps.tabIndex ?? -1}
                role={restProps.role ?? 'alert'}
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                onMouseEnter={(e) => {
                  restProps.onMouseEnter?.(e);

                  clearTid.current();
                }}
                onMouseLeave={(e) => {
                  restProps.onMouseLeave?.(e);

                  if (duration > 0) {
                    clearTid.current = async.setTimeout(() => {
                      onClose?.();
                    }, duration * 1000);
                  }
                }}
                onKeyDown={(e) => {
                  restProps.onKeyDown?.(e);

                  if (visible && escClosable && e.code === 'Escape') {
                    e.stopPropagation();
                    e.preventDefault();
                    clearTid.current();
                    onClose?.();
                  }
                }}
              >
                {icon !== false && (!isUndefined(type) || checkNodeExist(icon)) && (
                  <div {...styled('notification__icon')}>
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
                <div {...styled('notification__content')}>
                  <div {...styled('notification__header')}>
                    <div {...styled('notification__title')} id={titleId}>
                      {title}
                    </div>
                    {closable && (
                      <button {...styled('notification__close')} aria-label={t('Close')} onClick={onClose}>
                        <Icon>
                          <CloseOutlined />
                        </Icon>
                      </button>
                    )}
                  </div>
                  {checkNodeExist(children) && (
                    <div {...styled('notification__description')} id={descriptionId}>
                      {children}
                    </div>
                  )}
                </div>
              </div>
            )}
          </LazyLoading>
        )}
      </CollapseTransition>
    </Portal>
  );
}
