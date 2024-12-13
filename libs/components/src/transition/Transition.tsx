/* eslint-disable @typescript-eslint/no-empty-function */
import type { TransitionProps } from './types';
import type { ArrayElement } from '../types';

import { useAsync, useForceUpdate, useIsomorphicLayoutEffect, useUnmount } from '@laser-ui/hooks';
import { isNumber, isUndefined } from 'lodash';
import { useRef } from 'react';

const CLASSES = ['enter-from', 'enter-active', 'enter-to', 'leave-from', 'leave-active', 'leave-to'] as const;

export function Transition(props: TransitionProps): React.ReactElement | null {
  const {
    children,
    enter,
    name,
    duration,
    skipFirstTransition = true,
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onBeforeLeave,
    onLeave,
    onAfterLeave,
  } = props;

  const forceUpdate = useForceUpdate();
  const async = useAsync();

  const el = useRef<HTMLElement>(null);

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

    resetClasses.current();
    resetClasses.current = () => {
      if (el.current && name) {
        for (const className of CLASSES) {
          el.current.classList.toggle(`${name}-${className}`, false);
        }
      }
    };

    if (!skipTransition.current) {
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
        onBeforeEnter?.(el.current);
        addClasses(['enter-from', 'enter-active']);
        async.setAfterPainted(() => {
          removeClasses(['enter-from', 'enter-active']);
          onEnter?.(el.current);
          addClasses(['enter-active', 'enter-to']);
          const handleAfterEnter = () => {
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
        onBeforeLeave?.(el.current);
        addClasses(['leave-from', 'leave-active']);
        async.setAfterPainted(() => {
          removeClasses(['leave-from', 'leave-active']);
          onLeave?.(el.current);
          addClasses(['leave-active', 'leave-to']);
          const handleAfterLeave = () => {
            clearTransitionEnd.current();
            removeClasses(['leave-active', 'leave-to']);
            onAfterLeave?.(el.current);
            leaved.current = true;
            forceUpdate();
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
