import type { ModalProps } from './types';

import { isNumber, isString, isUndefined } from 'lodash';
import { cloneElement, useId, useRef } from 'react';

import { ModalAlert } from './ModalAlert';
import { ModalFooter } from './ModalFooter';
import { ModalHeader } from './ModalHeader';
import { CLASSES } from './vars';
import { useComponentProps, useLockScroll, useMaxIndex, useNamespace, useStyled } from '../hooks';
import { Mask } from '../internal/mask';
import { Portal } from '../internal/portal';
import { Transition } from '../internal/transition';
import { ROOT_DATA } from '../root/vars';
import { handleModalKeyDown, mergeCS } from '../utils';
import { TTANSITION_DURING_BASE } from '../vars';

export const Modal: {
  (props: ModalProps): JSX.Element | null;
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
    destroyAfterClose = true,
    zIndex: zIndexProp,
    onClose,
    afterVisibleChange,

    ...restProps
  } = useComponentProps('Modal', props);

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { modal: styleProvider?.modal }, styleOverrides);

  const modalRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const dataRef = useRef<{
    transformOrigin?: string;
    prevActiveEl: HTMLElement | null;
  }>({
    prevActiveEl: null,
  });

  const uniqueId = useId();
  const titleId = `${namespace}-modal-title-${uniqueId}`;
  const bodyId = `${namespace}-modal-content-${uniqueId}`;

  const maxZIndex = useMaxIndex(visible);
  const zIndex = !isUndefined(zIndexProp) ? zIndexProp : `calc(var(--${namespace}-zindex-fixed) + ${maxZIndex})`;

  useLockScroll(visible);

  const headerNode = (() => {
    if (headerProp) {
      const node = isString(headerProp) ? <ModalHeader>{headerProp}</ModalHeader> : headerProp;
      return cloneElement(node, {
        _id: titleId,
        _onClose: () => {
          onClose?.();
        },
      });
    }
  })();

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
        during={TTANSITION_DURING_BASE}
        skipFirstTransition={skipFirstTransition}
        destroyWhenLeaved={destroyAfterClose}
        afterRender={() => {
          if (isUndefined(ROOT_DATA.clickEvent) || performance.now() - ROOT_DATA.clickEvent.time > 100) {
            dataRef.current.transformOrigin = undefined;
          } else if (modalContentRef.current) {
            const left = `${(ROOT_DATA.windowSize.width - modalContentRef.current.offsetWidth) / 2}px`;
            const top =
              topProp === 'center'
                ? `${(ROOT_DATA.windowSize.height - modalContentRef.current.offsetHeight) / 2}px`
                : `${topProp}${isNumber(topProp) ? 'px' : ''}`;
            dataRef.current.transformOrigin = `calc(${ROOT_DATA.clickEvent.x}px - ${left}) calc(${ROOT_DATA.clickEvent.y}px - ${top})`;
          }
        }}
        afterEnter={() => {
          afterVisibleChange?.(true);

          dataRef.current.prevActiveEl = document.activeElement as HTMLElement | null;
          if (modalRef.current) {
            modalRef.current.focus({ preventScroll: true });
          }
        }}
        afterLeave={() => {
          afterVisibleChange?.(false);

          if (dataRef.current.prevActiveEl) {
            dataRef.current.prevActiveEl.focus({ preventScroll: true });
          }
        }}
      >
        {(state) => {
          let transitionStyle: React.CSSProperties = {};
          switch (state) {
            case 'enter':
              transitionStyle = { transform: 'scale(0.3)', opacity: 0 };
              break;

            case 'entering':
              transitionStyle = {
                transition: ['transform', 'opacity'].map((attr) => `${attr} ${TTANSITION_DURING_BASE}ms ease-out`).join(', '),
                transformOrigin: dataRef.current.transformOrigin,
              };
              break;

            case 'leaving':
              transitionStyle = {
                transform: 'scale(0.3)',
                opacity: 0,
                transition: ['transform', 'opacity'].map((attr) => `${attr} ${TTANSITION_DURING_BASE}ms ease-in`).join(', '),
                transformOrigin: dataRef.current.transformOrigin,
              };
              break;

            default:
              break;
          }

          return (
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
                    display: state === 'leaved' ? 'none' : undefined,
                    zIndex,
                  },
                },
              )}
              ref={modalRef}
              tabIndex={restProps.tabIndex ?? -1}
              role="dialog"
              aria-modal
              aria-labelledby={headerNode ? titleId : undefined}
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
                    ...transitionStyle,
                  },
                })}
                ref={modalContentRef}
              >
                {headerNode}
                <div {...styled('modal__body')} id={bodyId}>
                  {alert ?? children}
                </div>
                {footer &&
                  cloneElement(footer, {
                    _onClose: () => {
                      onClose?.();
                    },
                  })}
              </div>
            </div>
          );
        }}
      </Transition>
    </Portal>
  );
};

Modal.Header = ModalHeader;
Modal.Footer = ModalFooter;
Modal.Alert = ModalAlert;
