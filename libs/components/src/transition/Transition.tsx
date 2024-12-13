/* eslint-disable @typescript-eslint/no-empty-function */
import type { TransitionProps } from './types';
import type { ArrayElement } from '../types';

import { useAsync, useForceUpdate, useIsomorphicLayoutEffect, useMount, useUnmount } from '@laser-ui/hooks';
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
    destroyWhenLeaved = false,
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
  const leaved = useRef(skipFirstTransition ? !enter : false);
  if (enter) {
    leaved.current = false;
  }

  const resetClasses = useRef(() => {});
  const clearTransitionEnd = useRef(() => {});
  useIsomorphicLayoutEffect(() => {
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
        onBeforeEnter?.();
        if (el.current && el.current.style.display === 'none') {
          el.current.style.display = '';
        }
        addClasses(['enter-from', 'enter-active']);
        async.setAfterPainted(() => {
          removeClasses(['enter-from', 'enter-active']);
          onEnter?.();
          addClasses(['enter-active', 'enter-to']);
          const handleAfterEnter = (e: any) => {
            const enter = () => {
              clearTransitionEnd.current();
              removeClasses(['enter-active', 'enter-to']);
              onAfterEnter?.();
            };
            if (e instanceof Event) {
              if (e.target === e.currentTarget) {
                enter();
              }
            } else {
              enter();
            }
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
        onBeforeLeave?.();
        addClasses(['leave-from', 'leave-active']);
        async.setAfterPainted(() => {
          removeClasses(['leave-from', 'leave-active']);
          onLeave?.();
          addClasses(['leave-active', 'leave-to']);
          const handleAfterLeave = (e: any) => {
            const leave = () => {
              clearTransitionEnd.current();
              removeClasses(['leave-active', 'leave-to']);
              onAfterLeave?.();
              if (el.current) {
                el.current.style.display = 'none';
              }
              leaved.current = true;
              if (destroyWhenLeaved) {
                forceUpdate();
              }
            };
            if (e instanceof Event) {
              if (e.target === e.currentTarget) {
                leave();
              }
            } else {
              leave();
            }
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

  useMount(() => {
    skipTransition.current = false;
  });

  useUnmount(() => {
    clearTransitionEnd.current();
    resetClasses.current();
  });

  return destroyWhenLeaved && leaved.current ? null : children(el);
}
