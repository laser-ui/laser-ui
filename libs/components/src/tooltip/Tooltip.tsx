import type { TooltipProps, TooltipRef } from './types';

import { useEventCallback, useRefExtra } from '@laser-ui/hooks';
import { isFunction, isUndefined } from 'lodash';
import { cloneElement, forwardRef, useId, useImperativeHandle, useRef, useState } from 'react';

import { CLASSES, TTANSITION_DURING } from './vars';
import { useComponentProps, useControlled, useMaxIndex, useNamespace, useStyled } from '../hooks';
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

  const uniqueId = useId();
  const id = restProps.id ?? `${namespace}-tooltip-${uniqueId}`;

  const triggerRef = useRefExtra<HTMLElement>(() => document.querySelector(`[aria-describedby="${id}"]`));
  const popupRef = useRef<HTMLDivElement>(null);
  const scrollingRef = useRefExtra(scrolling);

  const [visible, changeVisible] = useControlled<boolean>(defaultVisible ?? false, visibleProp, onVisibleChange);

  const maxZIndex = useMaxIndex(visible);
  const zIndex = !isUndefined(zIndexProp) ? zIndexProp : `calc(var(--${namespace}-zindex-fixed) + ${maxZIndex})`;

  const [popupPositionStyle, setPopupPositionStyle] = useState<React.CSSProperties>({
    top: '-200vh',
    left: '-200vw',
  });
  const [transformOrigin, setTransformOrigin] = useState<string>();
  const [placement, setPlacement] = useState(placementProp);
  const updatePosition = useEventCallback(() => {
    if (visible && triggerRef.current && popupRef.current) {
      const position = getPopupPosition(
        triggerRef.current,
        { width: popupRef.current.offsetWidth, height: popupRef.current.offsetHeight },
        {
          placement: placementProp,
          placementFallback: placement,
          placementFixed,
          gap,
          inWindow,
        },
      );
      setPopupPositionStyle({
        top: position.top,
        left: position.left,
      });
      setTransformOrigin(position.transformOrigin);
      setPlacement(position.placement);
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
        popupRef,
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
                        transformOrigin,
                      };
                      break;

                    case 'leaving':
                      transitionStyle = {
                        transform: 'scale(0.3)',
                        opacity: 0,
                        transition: ['transform', 'opacity'].map((attr) => `${attr} ${TTANSITION_DURING.leave}ms ease-in`).join(', '),
                        transformOrigin,
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
                      {...mergeCS(styled('tooltip', `tooltip--${placement}`), {
                        className: restProps.className,
                        style: {
                          ...restProps.style,
                          zIndex,
                          ...popupPositionStyle,
                          ...transitionStyle,
                        },
                      })}
                      ref={popupRef}
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
