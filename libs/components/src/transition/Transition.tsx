/* eslint-disable @typescript-eslint/no-empty-function */
import type { TransitionProps } from './types';
import type { ArrayElement } from '../types';

import { useAsync, useForceUpdate, useIsomorphicLayoutEffect, useUnmount } from '@laser-ui/hooks';
import { isNumber, isUndefined } from 'lodash';
import { useRef } from 'react';
import { flushSync } from 'react-dom';

const CLASSES = ['enter-from', 'enter-active', 'enter-to', 'leave-from', 'leave-active', 'leave-to'] as const;

export function Transition(props: TransitionProps): React.ReactElement | null {
  const {
    children,
    enter,
    name,
    duration,
    skipFirstTransition = true,
    onSkipEnter,
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onEnterCancelled,
    onSkipLeave,
    onBeforeLeave,
    onLeave,
    onAfterLeave,
    onLeaveCancelled,
  } = props;

  const forceUpdate = useForceUpdate();
  const async = useAsync();

  const el = useRef<HTMLElement>(null);

  const entering = useRef(false);
  const leaving = useRef(false);

  const skipTransition = useRef(skipFirstTransition);
  const prevEnter = useRef(enter);
  const leaved = useRef(skipFirstTransition ? !enter : false);
  if (enter) {
    leaved.current = false;
  }

  const resetClasses = useRef(() => {});
  const clearTransitionEnd = useRef(() => {});
  useIsomorphicLayoutEffect(() => {
    if (enter !== prevEnter.current) {
      skipTransition.current = false;
    }
    prevEnter.current = enter;

    if (!skipTransition.current) {
      if (entering.current) {
        entering.current = false;
        onEnterCancelled?.(el.current);
      }
      if (leaving.current) {
        leaving.current = false;
        onLeaveCancelled?.(el.current);
      }

      resetClasses.current();
      resetClasses.current = () => {
        if (el.current && name) {
          for (const className of CLASSES) {
            el.current.classList.toggle(`${name}-${className}`, false);
          }
        }
      };

      const addClasses = (classes: ArrayElement<typeof CLASSES>[]) => {
        if (el.current && name) {
          for (const className of classes) {
            el.current.classList.toggle(`${name}-${className}`, true);
          }
        }
      };
      const removeClasses = (classes: ArrayElement<typeof CLASSES>[]) => {
        if (el.current && name) {
          for (const className of classes) {
            el.current.classList.toggle(`${name}-${className}`, false);
          }
        }
      };
      if (enter) {
        entering.current = true;
        onBeforeEnter?.(el.current);
        addClasses(['enter-from', 'enter-active']);
        async.setAfterPainted(() => {
          removeClasses(['enter-from', 'enter-active']);
          onEnter?.(el.current);
          addClasses(['enter-active', 'enter-to']);
          const handleAfterEnter = () => {
            entering.current = false;
            clearTransitionEnd.current();
            removeClasses(['enter-active', 'enter-to']);
            onAfterEnter?.(el.current);
          };
          if (isUndefined(duration)) {
            if (el.current) {
              el.current.addEventListener('transitionend', handleAfterEnter);
              clearTransitionEnd.current = () => {
                if (el.current) {
                  el.current.removeEventListener('transitionend', handleAfterEnter);
                }
              };
            }
          } else {
            const tid = setTimeout(handleAfterEnter, isNumber(duration) ? duration : duration.enter);
            clearTransitionEnd.current = () => {
              clearTimeout(tid);
            };
          }
        });
      } else {
        leaving.current = true;
        onBeforeLeave?.(el.current);
        addClasses(['leave-from', 'leave-active']);
        async.setAfterPainted(() => {
          removeClasses(['leave-from', 'leave-active']);
          onLeave?.(el.current);
          addClasses(['leave-active', 'leave-to']);
          const handleAfterLeave = () => {
            leaving.current = false;
            clearTransitionEnd.current();
            removeClasses(['leave-active', 'leave-to']);
            onAfterLeave?.(el.current);
            leaved.current = true;
            flushSync(() => {
              forceUpdate();
            });
          };
          if (isUndefined(duration)) {
            if (el.current) {
              el.current.addEventListener('transitionend', handleAfterLeave);
              clearTransitionEnd.current = () => {
                if (el.current) {
                  el.current.removeEventListener('transitionend', handleAfterLeave);
                }
              };
            }
          } else {
            const tid = setTimeout(handleAfterLeave, isNumber(duration) ? duration : duration.leave);
            clearTransitionEnd.current = () => {
              clearTimeout(tid);
            };
          }
        });
      }
    } else {
      if (enter) {
        onSkipEnter?.(el.current);
      } else {
        onSkipLeave?.(el.current);
      }
    }
    return () => {
      async.clearAll();
      clearTransitionEnd.current();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enter]);

  useUnmount(() => {
    async.clearAll();
    clearTransitionEnd.current();
    resetClasses.current();
  });

  return children((instance) => {
    el.current = instance;
  }, leaved.current);
}
