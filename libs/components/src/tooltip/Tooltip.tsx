import type { TooltipProps, TooltipRef } from './types';

import { useEventCallback, useRefExtra } from '@laser-ui/hooks';
import { isFunction, isUndefined } from 'lodash';
import { cloneElement, forwardRef, useId, useImperativeHandle, useRef } from 'react';

import { CLASSES, TTANSITION_DURING } from './vars';
import { useComponentProps, useControlled, useJSS, useMaxIndex, useNamespace, useStyled } from '../hooks';
import { Popup } from '../internal/popup';
import { Portal } from '../internal/portal';
import { Transition } from '../internal/transition';
import { getPopupPosition, mergeCS } from '../utils';

export const Tooltip = forwardRef<TooltipRef, TooltipProps>((props, ref): JSX.Element | null => {
  const {
    children,
    styleOverrides,
    styleProvider,
    title,
    visible: visibleProp,
    defaultVisible,
    trigger = 'hover',
    placement: placementProp = 'top',
    placementFixed = false,
    arrow = true,
    escClosable = true,
    gap = 10,
    inWindow = false,
    mouseEnterDelay = 150,
    mouseLeaveDelay = 200,
    skipFirstTransition = true,
    destroyAfterClose = true,
    zIndex: zIndexProp,
    scrolling,
    onVisibleChange,
    afterVisibleChange,

    ...restProps
  } = useComponentProps('Tooltip', props);

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { tooltip: styleProvider?.tooltip }, styleOverrides);
  const sheet = useJSS<'position'>();

  const uniqueId = useId();
  const id = restProps.id ?? `${namespace}-tooltip-${uniqueId}`;

  const triggerRef = useRefExtra<HTMLElement>(() => document.querySelector(`[aria-describedby="${id}"]`));
  const tooltipRef = useRef<HTMLDivElement>(null);
  const scrollingRef = useRefExtra(scrolling);

  const [visible, changeVisible] = useControlled<boolean>(defaultVisible ?? false, visibleProp, onVisibleChange);

  const maxZIndex = useMaxIndex(visible);
  const zIndex = !isUndefined(zIndexProp) ? zIndexProp : `calc(var(--${namespace}-zindex-fixed) + ${maxZIndex})`;

  const transformOrigin = useRef<string>();
  const placement = useRef(placementProp);
  const updatePosition = useEventCallback(() => {
    if (visible && triggerRef.current && tooltipRef.current) {
      const position = getPopupPosition(
        triggerRef.current,
        { width: tooltipRef.current.offsetWidth, height: tooltipRef.current.offsetHeight },
        {
          placement: placementProp,
          placementFallback: placement.current,
          placementFixed,
          gap,
          inWindow,
        },
      );
      transformOrigin.current = position.transformOrigin;
      tooltipRef.current.classList.toggle(`${namespace}-tooltip--${placement.current}`, false);
      placement.current = position.placement;
      tooltipRef.current.classList.toggle(`${namespace}-tooltip--${placement.current}`, true);
      if (sheet.classes.position) {
        tooltipRef.current.classList.toggle(sheet.classes.position, false);
      }
      sheet.replaceRule('position', {
        top: position.top,
        left: position.left,
      });
      tooltipRef.current.classList.toggle(sheet.classes.position, true);
    }
  });

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
        popupRef: tooltipRef,
        containerRefs: [scrollingRef],
      }}
      onVisibleChange={changeVisible}
    >
      {({ renderTrigger, renderPopup }) => {
        const render = (el: React.ReactElement) =>
          renderTrigger(
            cloneElement<React.HTMLAttributes<HTMLElement>>(el, {
              'aria-describedby': id,
              onKeyDown: (e) => {
                el.props.onKeyDown?.(e);

                if (visible && escClosable && e.code === 'Escape') {
                  e.stopPropagation();
                  e.preventDefault();
                  changeVisible(false);
                }
              },
            }),
          );
        return (
          <>
            {isFunction(children) ? children(render) : render(children)}
            <Portal
              selector={() => {
                let el = document.getElementById(`${namespace}-tooltip-root`);
                if (!el) {
                  el = document.createElement('div');
                  el.id = `${namespace}-tooltip-root`;
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
                }}
                afterLeave={() => {
                  afterVisibleChange?.(false);
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

                    case 'leaved':
                      transitionStyle = { display: 'none' };
                      break;

                    default:
                      break;
                  }

                  return renderPopup(
                    <div
                      {...restProps}
                      {...mergeCS(styled('tooltip'), {
                        className: restProps.className,
                        style: {
                          ...restProps.style,
                          zIndex,
                          ...transitionStyle,
                        },
                      })}
                      ref={tooltipRef}
                      id={id}
                      role="tooltip"
                    >
                      {arrow && <div {...styled('tooltip__arrow')} />}
                      {title}
                    </div>,
                  );
                }}
              </Transition>
            </Portal>
          </>
        );
      }}
    </Popup>
  );
});
