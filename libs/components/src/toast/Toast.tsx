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
import { Portal } from '../internal/portal';
import { Transition } from '../internal/transition';
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
    destroyAfterClose = true,
    onClose,
    afterVisibleChange,

    ...restProps
  } = useComponentProps('Toast', props);

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { toast: styleProvider?.toast }, styleOverrides);

  const { t } = useTranslation();
  const async = useAsync();

  const toastRef = useRef<HTMLDivElement>(null);

  const dataRef = useRef<{
    clearTid?: () => void;
  }>({});

  const uniqueId = useId();
  const messageId = `${namespace}-toast-content-${uniqueId}`;

  useMount(() => {
    if (duration > 0) {
      dataRef.current.clearTid = async.setTimeout(() => {
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
      <Transition
        enter={visible}
        during={TTANSITION_DURING}
        skipFirstTransition={skipFirstTransition}
        destroyWhenLeaved={destroyAfterClose}
        afterEnter={() => {
          afterVisibleChange?.(true);
        }}
        afterLeave={() => {
          afterVisibleChange?.(false);
        }}
      >
        {(state) => {
          let transitionStyle: React.CSSProperties = {};
          switch (state) {
            case 'enter':
              transitionStyle = {
                transform: placement === 'top' ? 'translate(0, -70%)' : 'translate(0, 70%)',
                opacity: 0,
              };
              break;

            case 'entering':
              transitionStyle = {
                transition: ['transform', 'opacity'].map((attr) => `${attr} ${TTANSITION_DURING.enter}ms ease-out`).join(', '),
              };
              break;

            case 'leave':
              if (toastRef.current) {
                const height = toastRef.current.offsetHeight;
                transitionStyle = { height, overflow: 'hidden' };
              }
              break;

            case 'leaving':
              transitionStyle = {
                height: 0,
                overflow: 'hidden',
                paddingTop: 0,
                paddingBottom: 0,
                marginTop: 0,
                marginBottom: 0,
                opacity: 0,
                transition: ['height', 'padding', 'margin', 'opacity']
                  .map((attr) => `${attr} ${TTANSITION_DURING.leave}ms ease-in`)
                  .join(', '),
              };
              break;

            case 'leaved':
              transitionStyle = { display: 'none' };
              break;

            default:
              break;
          }

          return (
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
                    ...transitionStyle,
                  },
                },
              )}
              ref={toastRef}
              tabIndex={restProps.tabIndex ?? -1}
              role={restProps.role ?? 'alert'}
              aria-describedby={messageId}
              onMouseEnter={(e) => {
                restProps.onMouseEnter?.(e);

                dataRef.current.clearTid?.();
              }}
              onMouseLeave={(e) => {
                restProps.onMouseLeave?.(e);

                if (duration > 0) {
                  dataRef.current.clearTid = async.setTimeout(() => {
                    onClose?.();
                  }, duration * 1000);
                }
              }}
              onKeyDown={(e) => {
                restProps.onKeyDown?.(e);

                if (visible && escClosable && e.code === 'Escape') {
                  e.stopPropagation();
                  e.preventDefault();
                  dataRef.current.clearTid?.();
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
          );
        }}
      </Transition>
    </Portal>
  );
}
