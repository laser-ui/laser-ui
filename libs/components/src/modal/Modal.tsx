import type { ModalProps } from './types';

import { isNumber, isString, isUndefined } from 'lodash';
import { useId, useRef } from 'react';

import { ModalAlert } from './ModalAlert';
import { ModalFooter } from './ModalFooter';
import { ModalHeader } from './ModalHeader';
import { CLASSES, ModalContext } from './vars';
import { useComponentProps, useLockScroll, useNamespace, useStyled, useZIndex } from '../hooks';
import { LazyLoading } from '../internal/lazy-loading';
import { Portal } from '../internal/portal';
import { Mask } from '../mask';
import { ROOT_DATA } from '../root/vars';
import { Transition } from '../transition';
import { handleModalKeyDown, mergeCS } from '../utils';
import { TTANSITION_DURING_BASE } from '../vars';

export const Modal: {
  (props: ModalProps): React.ReactElement | null;
  Header: typeof ModalHeader;
  Footer: typeof ModalFooter;
  Alert: typeof ModalAlert;
} = (props) => {
  const {
    children,
    styleOverrides,
    styleProvider,
    visible,
    header: headerProp,
    footer,
    alert,
    width = 520,
    top: topProp = 100,
    mask = true,
    maskClosable = true,
    escClosable = true,
    skipFirstTransition = true,
    destroyAfterClose = false,
    lazyLoading = true,
    zIndex: zIndexProp,
    onClose,
    afterVisibleChange,

    ...restProps
  } = useComponentProps('Modal', props);

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { modal: styleProvider?.modal }, styleOverrides);

  const modalRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const prevActiveEl = useRef<HTMLElement>(null);

  const uniqueId = useId();
  const titleId = `${namespace}-modal-title-${uniqueId}`;
  const bodyId = `${namespace}-modal-content-${uniqueId}`;

  const zIndexValue = useZIndex(visible);
  const zIndex = !isUndefined(zIndexProp) ? zIndexProp : `calc(var(--${namespace}-zindex-fixed) + ${zIndexValue})`;

  useLockScroll(visible);

  return (
    <Portal
      selector={() => {
        let el = document.getElementById(`${namespace}-modal-root`);
        if (!el) {
          el = document.createElement('div');
          el.id = `${namespace}-modal-root`;
          document.body.appendChild(el);
        }
        return el;
      }}
    >
      <Transition
        enter={visible}
        name={`${namespace}-modal`}
        duration={TTANSITION_DURING_BASE}
        skipFirstTransition={skipFirstTransition}
        onSkipEnter={(el) => {
          if (el) {
            if (isUndefined(ROOT_DATA.clickEvent) || performance.now() - ROOT_DATA.clickEvent.time > 100) {
              el.style.setProperty(`--modal-transform-origin`, 'unset');
            } else if (modalContentRef.current) {
              const left = `${(ROOT_DATA.windowSize.width - modalContentRef.current.offsetWidth) / 2}px`;
              const top =
                topProp === 'center'
                  ? `${(ROOT_DATA.windowSize.height - modalContentRef.current.offsetHeight) / 2}px`
                  : `${topProp}${isNumber(topProp) ? 'px' : ''}`;
              el.style.setProperty(
                `--modal-transform-origin`,
                `calc(${ROOT_DATA.clickEvent.x}px - ${left}) calc(${ROOT_DATA.clickEvent.y}px - ${top})`,
              );
            }
          }
        }}
        onBeforeEnter={(el) => {
          if (el) {
            if (isUndefined(ROOT_DATA.clickEvent) || performance.now() - ROOT_DATA.clickEvent.time > 100) {
              el.style.setProperty(`--modal-transform-origin`, 'unset');
            } else if (modalContentRef.current) {
              const left = `${(ROOT_DATA.windowSize.width - modalContentRef.current.offsetWidth) / 2}px`;
              const top =
                topProp === 'center'
                  ? `${(ROOT_DATA.windowSize.height - modalContentRef.current.offsetHeight) / 2}px`
                  : `${topProp}${isNumber(topProp) ? 'px' : ''}`;
              el.style.setProperty(
                `--modal-transform-origin`,
                `calc(${ROOT_DATA.clickEvent.x}px - ${left}) calc(${ROOT_DATA.clickEvent.y}px - ${top})`,
              );
            }
          }
        }}
        onAfterEnter={() => {
          afterVisibleChange?.(true);

          prevActiveEl.current = document.activeElement as HTMLElement | null;
          if (modalRef.current) {
            modalRef.current.focus({ preventScroll: true });
          }
        }}
        onAfterLeave={() => {
          afterVisibleChange?.(false);

          if (prevActiveEl.current) {
            prevActiveEl.current.focus({ preventScroll: true });
          }
        }}
      >
        {(transitionRef, leaved) => (
          <LazyLoading hidden={leaved} disabled={!lazyLoading}>
            {leaved && destroyAfterClose ? null : (
              <ModalContext
                value={{
                  id: titleId,
                  onClose: () => {
                    onClose?.();
                  },
                }}
              >
                <div
                  {...restProps}
                  {...mergeCS(
                    styled('modal', {
                      'modal--center': topProp === 'center',
                      'modal--alert': alert,
                    }),
                    {
                      className: restProps.className,
                      style: {
                        ...restProps.style,
                        zIndex,
                        ...(leaved ? { display: 'none' } : undefined),
                      },
                    },
                  )}
                  ref={(instance) => {
                    modalRef.current = instance;
                    return () => {
                      modalRef.current = null;
                    };
                  }}
                  tabIndex={restProps.tabIndex ?? -1}
                  role="dialog"
                  aria-modal
                  aria-labelledby={headerProp ? titleId : undefined}
                  aria-describedby={bodyId}
                  onKeyDown={(e) => {
                    restProps.onKeyDown?.(e);

                    if (visible && escClosable && e.code === 'Escape') {
                      e.stopPropagation();
                      e.preventDefault();
                      onClose?.();
                    }

                    handleModalKeyDown(e);
                  }}
                >
                  {mask && (
                    <Mask
                      visible={visible}
                      onClose={() => {
                        if (maskClosable) {
                          onClose?.();
                        }
                      }}
                    />
                  )}
                  <div
                    {...mergeCS(styled('modal__content'), {
                      style: {
                        width,
                        top: topProp === 'center' ? undefined : topProp,
                        maxHeight: topProp === 'center' ? undefined : `calc(100% - ${topProp}${isNumber(topProp) ? 'px' : ''} - 20px)`,
                      },
                    })}
                    ref={(instance) => {
                      modalContentRef.current = instance;
                      transitionRef(instance);
                      return () => {
                        modalContentRef.current = null;
                        transitionRef(null);
                      };
                    }}
                  >
                    {isString(headerProp) ? <ModalHeader>{headerProp}</ModalHeader> : headerProp}
                    <div {...styled('modal__body')} id={bodyId}>
                      {alert ?? children}
                    </div>
                    {footer}
                  </div>
                </div>
              </ModalContext>
            )}
          </LazyLoading>
        )}
      </Transition>
    </Portal>
  );
};

Modal.Header = ModalHeader;
Modal.Footer = ModalFooter;
Modal.Alert = ModalAlert;
