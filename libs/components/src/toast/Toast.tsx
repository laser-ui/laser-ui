import type { ToastProps } from './types';

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

export function Toast(props: ToastProps): React.ReactElement | null {
  const {
    children,
    styleOverrides,
    styleProvider,
    visible,
    type,
    placement = 'top',
    duration = 2,
    icon,
    closable = false,
    escClosable = true,
    skipFirstTransition = true,
    destroyAfterClose = false,
    lazyLoading = true,
    onClose,
    afterVisibleChange,

    ...restProps
  } = useComponentProps('Toast', props);

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { toast: styleProvider?.toast }, styleOverrides);

  const { t } = useTranslation();
  const async = useAsync();

  const toastRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const clearTid = useRef(() => {});

  const uniqueId = useId();
  const messageId = `${namespace}-toast-content-${uniqueId}`;

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
        const id = placement === 'top' ? `${namespace}-toast-t-root` : `${namespace}-toast-b-root`;

        let root = document.getElementById(`${namespace}-toast-root`);
        if (!root) {
          root = document.createElement('div');
          root.id = `${namespace}-toast-root`;
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
        name={`${namespace}-toast`}
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
                  styled('toast', {
                    [`toast--${type}`]: type,
                  }),
                  {
                    className: restProps.className,
                    style: {
                      ...restProps.style,
                      ...{
                        '--toast-transform': placement === 'top' ? 'translate(0, -70%)' : 'translate(0, 70%)',
                      },
                      ...(leaved ? { display: 'none' } : undefined),
                    },
                  },
                )}
                ref={(instance) => {
                  toastRef.current = instance;
                  transitionRef(instance);
                  return () => {
                    toastRef.current = null;
                    transitionRef(null);
                  };
                }}
                tabIndex={restProps.tabIndex ?? -1}
                role={restProps.role ?? 'alert'}
                aria-describedby={messageId}
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
                  <div {...styled('toast__icon')}>
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
                <div {...styled('toast__message')} id={messageId}>
                  {children}
                </div>
                {closable && (
                  <button {...styled('toast__close')} aria-label={t('Close')} onClick={onClose}>
                    <Icon>
                      <CloseOutlined />
                    </Icon>
                  </button>
                )}
              </div>
            )}
          </LazyLoading>
        )}
      </CollapseTransition>
    </Portal>
  );
}
