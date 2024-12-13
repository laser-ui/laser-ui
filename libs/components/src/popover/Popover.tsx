import type { PopoverProps, PopoverRef } from './types';

import { useEventCallback, useRefExtra } from '@laser-ui/hooks';
import { isFunction, isString, isUndefined } from 'lodash';
import { cloneElement, forwardRef, useId, useImperativeHandle, useRef } from 'react';

import { PopoverFooter } from './PopoverFooter';
import { PopoverHeader } from './PopoverHeader';
import { CLASSES, TTANSITION_DURING } from './vars';
import { useComponentProps, useControlled, useJSS, useLockScroll, useMaxIndex, useNamespace, useStyled } from '../hooks';
import { Popup } from '../internal/popup';
import { Portal } from '../internal/portal';
import { Transition } from '../internal/transition';
import { getPopupPosition, handleModalKeyDown, mergeCS } from '../utils';

function PopoverFC(props: PopoverProps, ref: React.ForwardedRef<PopoverRef>): React.ReactElement | null {
  const {
    children,
    styleOverrides,
    styleProvider,
    content,
    header: headerProp,
    footer,
    visible: visibleProp,
    defaultVisible,
    trigger: triggerProp = 'hover',
    placement: placementProp = 'top',
    placementFixed = false,
    arrow = true,
    escClosable = true,
    gap = 10,
    inWindow = false,
    mouseEnterDelay = 150,
    mouseLeaveDelay = 200,
    modal = false,
    skipFirstTransition = true,
    destroyAfterClose = true,
    zIndex: zIndexProp,
    onVisibleChange,
    afterVisibleChange,

    ...restProps
  } = useComponentProps('Popover', props);

  const trigger = modal ? 'click' : triggerProp;

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { popover: styleProvider?.popover }, styleOverrides);
  const sheet = useJSS<'position'>();

  const uniqueId = useId();
  let triggerId: string;
  const titleId = `${namespace}-popover-title-${uniqueId}`;
  const bodyId = `${namespace}-popover-content-${uniqueId}`;

  const triggerRef = useRefExtra(() => document.getElementById(triggerId));
  const popoverRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const dataRef = useRef<{
    prevActiveEl: HTMLElement | null;
  }>({
    prevActiveEl: null,
  });

  const [visible, changeVisible] = useControlled<boolean>(defaultVisible ?? false, visibleProp, onVisibleChange);

  const maxZIndex = useMaxIndex(visible);
  const zIndex = !isUndefined(zIndexProp) ? zIndexProp : `calc(var(--${namespace}-zindex-fixed) + ${maxZIndex})`;

  const transformOrigin = useRef<string>();
  const placement = useRef(placementProp);
  const updatePosition = useEventCallback(() => {
    if (visible && triggerRef.current && popoverRef.current && popupRef.current) {
      const position = getPopupPosition(
        triggerRef.current,
        { width: popupRef.current.offsetWidth, height: popupRef.current.offsetHeight },
        {
          placement: placementProp,
          placementFallback: placement.current,
          placementFixed,
          gap,
          inWindow,
        },
      );
      transformOrigin.current = position.transformOrigin;
      popoverRef.current.classList.toggle(`${namespace}-popover--${placement.current}`, false);
      placement.current = position.placement;
      popoverRef.current.classList.toggle(`${namespace}-popover--${placement.current}`, true);
      if (sheet.classes.position) {
        popupRef.current.classList.toggle(sheet.classes.position, false);
      }
      sheet.replaceRule('position', {
        top: position.top,
        left: position.left,
      });
      popupRef.current.classList.toggle(sheet.classes.position, true);
    }
  });

  useLockScroll(modal && visible);

  useImperativeHandle(
    ref,
    () => ({
      updatePosition,
    }),
    [updatePosition],
  );

  const headerNode = (() => {
    if (headerProp) {
      const node = isString(headerProp) ? <PopoverHeader>{headerProp}</PopoverHeader> : headerProp;
      return cloneElement(node, {
        _id: titleId,
        _onClose: () => {
          changeVisible(false);
        },
      });
    }
  })();

  return (
    <Popup
      visible={visible}
      trigger={trigger}
      mouseEnterDelay={mouseEnterDelay}
      mouseLeaveDelay={mouseLeaveDelay}
      updatePosition={{
        fn: updatePosition,
        triggerRef,
        popupRef,
      }}
      onVisibleChange={changeVisible}
    >
      {({ renderTrigger, renderPopup }) => {
        const render = (el: React.ReactElement) => {
          triggerId = el.props.id ?? `${namespace}-popover-trigger-${uniqueId}`;
          return renderTrigger(
            cloneElement<React.HTMLAttributes<HTMLElement>>(el, {
              id: triggerId,
              onKeyDown: (e) => {
                el.props.onKeyDown?.(e);

                if (visible) {
                  if (escClosable && e.code === 'Escape') {
                    e.stopPropagation();
                    e.preventDefault();
                    changeVisible(false);
                  }
                }
              },
            }),
          );
        };
        return (
          <>
            {isFunction(children) ? children(render) : render(children)}
            <Portal
              selector={() => {
                let el = document.getElementById(`${namespace}-popover-root`);
                if (!el) {
                  el = document.createElement('div');
                  el.id = `${namespace}-popover-root`;
                  document.body.appendChild(el);
                }
                return el;
              }}
            >
              <Transition
                enter={visible}
                during={TTANSITION_DURING}
                skipFirstTransition={skipFirstTransition}
                destroyWhenLeaved={destroyAfterClose}
                afterRender={updatePosition}
                afterEnter={() => {
                  afterVisibleChange?.(true);

                  if (modal) {
                    dataRef.current.prevActiveEl = document.activeElement as HTMLElement | null;
                    if (popoverRef.current) {
                      popoverRef.current.focus({ preventScroll: true });
                    }
                  }
                }}
                afterLeave={() => {
                  afterVisibleChange?.(false);

                  if (modal) {
                    if (dataRef.current.prevActiveEl) {
                      dataRef.current.prevActiveEl.focus({ preventScroll: true });
                    }
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
                        transition: ['transform', 'opacity'].map((attr) => `${attr} ${TTANSITION_DURING.enter}ms ease-out`).join(', '),
                        transformOrigin: transformOrigin.current,
                      };
                      break;

                    case 'leaving':
                      transitionStyle = {
                        transform: 'scale(0.3)',
                        opacity: 0,
                        transition: ['transform', 'opacity'].map((attr) => `${attr} ${TTANSITION_DURING.leave}ms ease-in`).join(', '),
                        transformOrigin: transformOrigin.current,
                      };
                      break;

                    default:
                      break;
                  }

                  return (
                    <div
                      {...restProps}
                      {...mergeCS(styled('popover'), {
                        className: restProps.className,
                        style: {
                          ...restProps.style,
                          zIndex,
                          display: state === 'leaved' ? 'none' : undefined,
                        },
                      })}
                      ref={popoverRef}
                      tabIndex={-1}
                      role={(restProps.role ?? modal) ? 'alertdialog' : 'dialog'}
                      aria-modal={modal}
                      aria-labelledby={headerNode ? titleId : undefined}
                      aria-describedby={bodyId}
                      onKeyDown={(e) => {
                        restProps.onKeyDown?.(e);

                        if (visible) {
                          if (escClosable && e.code === 'Escape') {
                            e.stopPropagation();
                            e.preventDefault();
                            changeVisible(false);
                          }
                        }

                        if (modal) {
                          handleModalKeyDown(e);
                        }
                      }}
                    >
                      {modal && (
                        <div
                          {...styled('popover__mask')}
                          onClick={() => {
                            changeVisible(false);
                          }}
                        />
                      )}
                      {renderPopup(
                        <div
                          ref={popupRef}
                          {...mergeCS(styled('popover__content'), {
                            style: transitionStyle,
                          })}
                        >
                          {arrow && <div {...styled('popover__arrow')} />}
                          {headerNode}
                          <div {...styled('popover__body')} id={bodyId}>
                            {content}
                          </div>
                          {footer &&
                            cloneElement(footer, {
                              _onClose: () => {
                                changeVisible(false);
                              },
                            })}
                        </div>,
                      )}
                    </div>
                  );
                }}
              </Transition>
            </Portal>
          </>
        );
      }}
    </Popup>
  );
}

export const Popover: {
  (props: PopoverProps & React.RefAttributes<PopoverRef>): React.ReactElement | null;
  Header: typeof PopoverHeader;
  Footer: typeof PopoverFooter;
} = forwardRef(PopoverFC) as any;

Popover.Header = PopoverHeader;
Popover.Footer = PopoverFooter;
