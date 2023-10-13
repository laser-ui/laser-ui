import type { PopupProps } from './types';

import { useAsync, useEvent, useRefExtra, useResize } from '@laser-ui/hooks';
import { isUndefined } from 'lodash';
import { cloneElement, useEffect, useRef } from 'react';

import { useLayout, useListenGlobalScrolling } from '../../hooks';

export function Popup(props: PopupProps): JSX.Element | null {
  const {
    children,
    visible: visibleProp,
    trigger,
    disabled = false,
    mouseEnterDelay = 150,
    mouseLeaveDelay = 200,
    updatePosition,
    onVisibleChange,
  } = props;

  const { pageScrollRef, contentResizeRef } = useLayout();

  const windowRef = useRefExtra(() => window);

  const dataRef = useRef<{
    clearTid?: () => void;
    clearClickOut?: () => void;
  }>({});

  const async = useAsync();

  const handleTrigger = (visible?: boolean, behavior?: 'hover' | 'popup-hover') => {
    dataRef.current.clearTid?.();

    const changeVisible = () => {
      if (isUndefined(visible)) {
        onVisibleChange(!visibleProp);
      } else if (!Object.is(visibleProp, visible)) {
        onVisibleChange(visible);
      }
    };

    if (behavior) {
      switch (behavior) {
        case 'hover':
          if (visible) {
            dataRef.current.clearTid = async.setTimeout(() => changeVisible(), mouseEnterDelay);
          } else {
            dataRef.current.clearTid = async.setTimeout(() => changeVisible(), mouseLeaveDelay);
          }
          break;

        case 'popup-hover':
          if (!visible) {
            dataRef.current.clearTid = async.setTimeout(() => changeVisible(), mouseLeaveDelay);
          }
          break;

        default:
          break;
      }
    } else {
      changeVisible();
    }
  };

  const listenGlobalScrolling = useListenGlobalScrolling(updatePosition.fn, disabled || !visibleProp);
  useEffect(() => {
    if (!disabled && visibleProp && !listenGlobalScrolling) {
      const els = [pageScrollRef, ...updatePosition.containerRefs].map((ref) => ref.current).filter((el) => el) as HTMLElement[];
      const listener = () => {
        updatePosition.fn();
      };
      els.forEach((el) => {
        el.addEventListener('scroll', listener, { passive: true });
      });

      return () => {
        els.forEach((el) => {
          el.removeEventListener('scroll', listener);
        });
      };
    }
  });

  useResize(updatePosition.triggerRef, updatePosition.fn, undefined, disabled || !visibleProp);
  useResize(updatePosition.popupRef, updatePosition.fn, undefined, disabled || !visibleProp);
  useResize(contentResizeRef, updatePosition.fn, undefined, disabled || !visibleProp);

  useEvent(
    windowRef,
    'click',
    () => {
      dataRef.current.clearClickOut = async.requestAnimationFrame(() => {
        handleTrigger(false);
      });
    },
    { capture: true },
    disabled || !visibleProp || trigger !== 'click',
  );

  return children({
    renderTrigger: (el) => {
      if (disabled) {
        return el;
      }

      const triggerProps: React.HTMLAttributes<HTMLElement> = {};
      switch (trigger) {
        case 'hover':
          triggerProps.onMouseEnter = (e) => {
            el.props.onMouseEnter?.(e);

            handleTrigger(true, 'hover');
          };
          triggerProps.onMouseLeave = (e) => {
            el.props.onMouseLeave?.(e);

            handleTrigger(false, 'hover');
          };
          break;

        case 'click':
          triggerProps.onClick = (e) => {
            el.props.onClick?.(e);

            dataRef.current.clearClickOut?.();
            handleTrigger();
          };
          break;

        default:
          break;
      }

      return cloneElement(el, triggerProps);
    },
    renderPopup: (el) => {
      if (disabled) {
        return el;
      }

      const popupProps: React.HTMLAttributes<HTMLElement> = {};
      if (visibleProp) {
        switch (trigger) {
          case 'hover':
            popupProps.onMouseEnter = (e) => {
              el.props.onMouseEnter?.(e);

              handleTrigger(true, 'popup-hover');
            };
            popupProps.onMouseLeave = (e) => {
              el.props.onMouseLeave?.(e);

              handleTrigger(false, 'popup-hover');
            };
            break;

          case 'click':
            popupProps.onClick = (e) => {
              el.props.onClick?.(e);

              dataRef.current.clearClickOut?.();
            };
            break;

          default:
            break;
        }
      }

      return cloneElement(el, popupProps);
    },
  });
}
