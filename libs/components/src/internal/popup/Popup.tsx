/* eslint-disable @typescript-eslint/no-empty-function */
import type { PopupProps } from './types';

import { useAsync, useEvent, useRefExtra, useResize } from '@laser-ui/hooks';
import { isUndefined } from 'lodash';
import { useRef } from 'react';

import { useContainerScrolling, useLayout } from '../../hooks';

export function Popup(props: PopupProps): React.ReactElement | null {
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

  const { contentResizeRef } = useLayout();

  const windowRef = useRefExtra(() => window);

  const clearTid = useRef(() => {});
  const clearClickOut = useRef(() => {});

  const async = useAsync();

  const handleTrigger = (visible?: boolean, behavior?: 'hover' | 'popup-hover') => {
    clearTid.current();

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
            clearTid.current = async.setTimeout(() => changeVisible(), mouseEnterDelay);
          } else {
            clearTid.current = async.setTimeout(() => changeVisible(), mouseLeaveDelay);
          }
          break;

        case 'popup-hover':
          if (!visible) {
            clearTid.current = async.setTimeout(() => changeVisible(), mouseLeaveDelay);
          }
          break;

        default:
          break;
      }
    } else {
      changeVisible();
    }
  };

  useContainerScrolling(updatePosition.triggerRef, updatePosition.fn, disabled || updatePosition.scroll === false || !visibleProp);

  useResize(updatePosition.triggerRef, updatePosition.fn, undefined, disabled || !visibleProp);
  useResize(updatePosition.popupRef, updatePosition.fn, undefined, disabled || !visibleProp);
  useResize(contentResizeRef, updatePosition.fn, undefined, disabled || !visibleProp);

  useEvent(
    windowRef,
    'click',
    () => {
      clearClickOut.current = async.requestAnimationFrame(() => {
        handleTrigger(false);
      });
    },
    { capture: true },
    disabled || !visibleProp || trigger !== 'click',
  );

  return children({
    trigger: {
      onClick: () => {
        if (!disabled && trigger === 'click') {
          clearClickOut.current();
          handleTrigger();
        }
      },
      onMouseEnter: () => {
        if (!disabled && trigger === 'hover') {
          handleTrigger(true, 'hover');
        }
      },
      onMouseLeave: () => {
        if (!disabled && trigger === 'hover') {
          handleTrigger(false, 'hover');
        }
      },
    },
    popup: {
      onClick: () => {
        if (!disabled && visibleProp && trigger === 'click') {
          clearClickOut.current();
        }
      },
      onMouseEnter: () => {
        if (!disabled && visibleProp && trigger === 'hover') {
          handleTrigger(true, 'popup-hover');
        }
      },
      onMouseLeave: () => {
        if (!disabled && visibleProp && trigger === 'hover') {
          handleTrigger(false, 'popup-hover');
        }
      },
    },
  });
}
