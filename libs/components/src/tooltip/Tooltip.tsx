import type { TooltipProps } from './types';

import { useEventCallback, useRefExtra } from '@laser-ui/hooks';
import { isUndefined } from 'lodash';
import { useId, useImperativeHandle, useRef } from 'react';

import { CLASSES, TTANSITION_DURING } from './vars';
import { useComponentProps, useControlled, useMaxIndex, useNamespace, useStyled } from '../hooks';
import { LazyLoading } from '../internal/lazy-loading';
import { Popup } from '../internal/popup';
import { Portal } from '../internal/portal';
import { Transition } from '../transition';
import { getPopupPosition, mergeCS } from '../utils';

export function Tooltip(props: TooltipProps): React.ReactElement | null {
  const {
    ref,
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
    destroyAfterClose = false,
    lazyLoading = true,
    zIndex: zIndexProp,
    onVisibleChange,
    afterVisibleChange,

    ...restProps
  } = useComponentProps('Tooltip', props);

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { tooltip: styleProvider?.tooltip }, styleOverrides);

  const uniqueId = useId();
  const id = restProps.id ?? `${namespace}-tooltip-${uniqueId}`;

  const triggerRef = useRefExtra<HTMLElement>(() => document.querySelector(`[aria-describedby="${id}"]`));
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [visible, changeVisible] = useControlled<boolean>(defaultVisible ?? false, visibleProp, onVisibleChange);

  const maxZIndex = useMaxIndex(visible);
  const zIndex = !isUndefined(zIndexProp) ? zIndexProp : `calc(var(--${namespace}-zindex-fixed) + ${maxZIndex})`;

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
      tooltipRef.current.style.setProperty(`--popup-transform-origin`, position.transformOrigin);
      tooltipRef.current.style.top = position.top + 'px';
      tooltipRef.current.style.left = position.left + 'px';
      tooltipRef.current.classList.toggle(`${namespace}-tooltip--${placement.current}`, false);
      placement.current = position.placement;
      tooltipRef.current.classList.toggle(`${namespace}-tooltip--${placement.current}`, true);
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
      }}
      onVisibleChange={changeVisible}
    >
      {(popupProps) => (
        <>
          {children({
            'aria-describedby': id,
            ...popupProps.trigger,
            onKeyDown: (e) => {
              if (visible && escClosable && e.code === 'Escape') {
                e.stopPropagation();
                e.preventDefault();
                changeVisible(false);
              }
            },
          })}
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
              name={`${namespace}-popup`}
              duration={TTANSITION_DURING}
              skipFirstTransition={skipFirstTransition}
              onBeforeEnter={updatePosition}
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
                      {...mergeCS(styled('tooltip'), {
                        className: restProps.className,
                        style: {
                          ...restProps.style,
                          ...{ '--popup-scale': 0.3 },
                          zIndex,
                          ...(leaved ? { display: 'none' } : undefined),
                        },
                      })}
                      ref={(instance) => {
                        tooltipRef.current = instance;
                        transitionRef(instance);
                        return () => {
                          tooltipRef.current = null;
                          transitionRef(null);
                        };
                      }}
                      id={id}
                      role="tooltip"
                      {...popupProps.popup}
                    >
                      {arrow && <div {...styled('tooltip__arrow')} />}
                      {title}
                    </div>
                  )}
                </LazyLoading>
              )}
            </Transition>
          </Portal>
        </>
      )}
    </Popup>
  );
}
