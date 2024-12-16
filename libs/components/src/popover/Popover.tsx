import type { PopoverProps } from './types';

import { useEventCallback, useRefExtra } from '@laser-ui/hooks';
import { isString, isUndefined } from 'lodash';
import { useId, useImperativeHandle, useRef } from 'react';

import { PopoverFooter } from './PopoverFooter';
import { PopoverHeader } from './PopoverHeader';
import { CLASSES, PopoverContext, TTANSITION_DURING } from './vars';
import { useComponentProps, useControlled, useLockScroll, useMaxIndex, useNamespace, useStyled } from '../hooks';
import { LazyLoading } from '../internal/lazy-loading';
import { Popup } from '../internal/popup';
import { Portal } from '../internal/portal';
import { Transition } from '../transition';
import { getPopupPosition, handleModalKeyDown, mergeCS } from '../utils';

export const Popover: {
  (props: PopoverProps): React.ReactElement | null;
  Header: typeof PopoverHeader;
  Footer: typeof PopoverFooter;
} = (props) => {
  const {
    ref,
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
    destroyAfterClose = false,
    lazyLoading = true,
    zIndex: zIndexProp,
    onVisibleChange,
    afterVisibleChange,

    ...restProps
  } = useComponentProps('Popover', props);

  const trigger = modal ? 'click' : triggerProp;

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { popover: styleProvider?.popover }, styleOverrides);

  const uniqueId = useId();
  const triggerId = `${namespace}-popover-trigger-${uniqueId}`;
  const titleId = `${namespace}-popover-title-${uniqueId}`;
  const bodyId = `${namespace}-popover-content-${uniqueId}`;

  const triggerRef = useRefExtra(() => document.getElementById(triggerId));
  const popoverRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const prevActiveEl = useRef<HTMLElement>(null);

  const [visible, changeVisible] = useControlled<boolean>(defaultVisible ?? false, visibleProp, onVisibleChange);

  const maxZIndex = useMaxIndex(visible);
  const zIndex = !isUndefined(zIndexProp) ? zIndexProp : `calc(var(--${namespace}-zindex-fixed) + ${maxZIndex})`;

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
      popoverRef.current.classList.toggle(`${namespace}-popover--${placement.current}`, false);
      placement.current = position.placement;
      popoverRef.current.classList.toggle(`${namespace}-popover--${placement.current}`, true);
      popupRef.current.style.setProperty(`--popup-transform-origin`, position.transformOrigin);
      popupRef.current.style.top = position.top + 'px';
      popupRef.current.style.left = position.left + 'px';
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
      {(popupProps) => (
        <>
          {children({
            id: triggerId,
            ...popupProps.trigger,
            onKeyDown: (e) => {
              if (visible) {
                if (escClosable && e.code === 'Escape') {
                  e.stopPropagation();
                  e.preventDefault();
                  changeVisible(false);
                }
              }
            },
          })}
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
              name={`${namespace}-popup`}
              duration={TTANSITION_DURING}
              skipFirstTransition={skipFirstTransition}
              onSkipEnter={updatePosition}
              onBeforeEnter={(el) => {
                updatePosition();
                if (el) {
                  el.style.setProperty(`--popup-duration`, TTANSITION_DURING.enter + 'ms');
                }
              }}
              onAfterEnter={() => {
                afterVisibleChange?.(true);

                if (modal) {
                  prevActiveEl.current = document.activeElement as HTMLElement | null;
                  if (popoverRef.current) {
                    popoverRef.current.focus({ preventScroll: true });
                  }
                }
              }}
              onBeforeLeave={(el) => {
                if (el) {
                  el.style.setProperty(`--popup-duration`, TTANSITION_DURING.leave + 'ms');
                }
              }}
              onAfterLeave={() => {
                afterVisibleChange?.(false);

                if (modal) {
                  if (prevActiveEl.current) {
                    prevActiveEl.current.focus({ preventScroll: true });
                  }
                }
              }}
            >
              {(transitionRef, leaved) => (
                <LazyLoading hidden={leaved} disabled={!lazyLoading}>
                  {leaved && destroyAfterClose ? null : (
                    <PopoverContext
                      value={{
                        id: titleId,
                        onClose: () => {
                          changeVisible(false);
                        },
                      }}
                    >
                      <div
                        {...restProps}
                        {...mergeCS(styled('popover'), {
                          className: restProps.className,
                          style: {
                            ...restProps.style,
                            ...{ '--popup-scale': 0.3 },
                            zIndex,
                            ...(leaved ? { display: 'none' } : undefined),
                          },
                        })}
                        ref={popoverRef}
                        tabIndex={-1}
                        role={(restProps.role ?? modal) ? 'alertdialog' : 'dialog'}
                        aria-modal={modal}
                        aria-labelledby={headerProp ? titleId : undefined}
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
                        <div
                          {...styled('popover__content')}
                          ref={(instance) => {
                            popupRef.current = instance;
                            transitionRef(instance);
                            return () => {
                              popupRef.current = null;
                              transitionRef(null);
                            };
                          }}
                          {...popupProps.popup}
                        >
                          {arrow && <div {...styled('popover__arrow')} />}
                          {isString(headerProp) ? <PopoverHeader>{headerProp}</PopoverHeader> : headerProp}
                          <div {...styled('popover__body')} id={bodyId}>
                            {content}
                          </div>
                          {footer}
                        </div>
                      </div>
                    </PopoverContext>
                  )}
                </LazyLoading>
              )}
            </Transition>
          </Portal>
        </>
      )}
    </Popup>
  );
};

Popover.Header = PopoverHeader;
Popover.Footer = PopoverFooter;
