/* eslint-disable @typescript-eslint/no-empty-function */
import type { CollapseTransitionProps } from './types';

import { isNumber } from 'lodash';
import { useRef } from 'react';

import { Transition } from './Transition';
import { useNamespace } from '../hooks';

export function CollapseTransition(props: CollapseTransitionProps): React.ReactElement | null {
  const {
    children,
    name,
    onBeforeEnter,
    onEnter,
    onEnterCancelled,
    onBeforeLeave,
    onLeave,
    onLeaveCancelled,
    width = 0,
    height,

    ...restProps
  } = props;

  const namespace = useNamespace();

  const el = useRef<HTMLElement>(null);

  const cancelled = useRef(false);
  const offsetWidth = useRef(0);
  const offsetHeight = useRef(0);

  const saveSize = (el: HTMLElement | null) => {
    if (el) {
      offsetWidth.current = el.offsetWidth;
      offsetHeight.current = el.offsetHeight;
    }
  };

  const setSize = (el: HTMLElement | null, size: { width: number; height: number }) => {
    if (el) {
      if (isNumber(height)) {
        el.style.setProperty(`--${namespace}-collapse-vertical`, size.height + 'px');
      } else {
        el.style.setProperty(`--${namespace}-collapse-horizontal`, size.width + 'px');
      }
    }
  };

  return (
    <Transition
      {...restProps}
      name={name ?? (isNumber(height) ? `${namespace}-collapse-vertical` : `${namespace}-collapse-horizontal`)}
      onBeforeEnter={(el) => {
        onBeforeEnter?.(el);

        if (cancelled.current) {
          setSize(el, { width: offsetWidth.current, height: offsetHeight.current });
        } else {
          setSize(el, { width, height: height ?? 0 });
        }
        cancelled.current = false;
        saveSize(el);
      }}
      onEnter={(el) => {
        onEnter?.(el);

        setSize(el, { width: offsetWidth.current, height: offsetHeight.current });
      }}
      onEnterCancelled={(el) => {
        onEnterCancelled?.(el);

        cancelled.current = true;
        saveSize(el);
      }}
      onBeforeLeave={(el) => {
        onBeforeLeave?.(el);

        if (!cancelled.current) {
          saveSize(el);
        }
        setSize(el, { width: offsetWidth.current, height: offsetHeight.current });
        cancelled.current = false;
      }}
      onLeave={(el) => {
        onLeave?.(el);

        setSize(el, { width, height: height ?? 0 });
      }}
      onLeaveCancelled={(el) => {
        onLeaveCancelled?.(el);

        cancelled.current = true;
        saveSize(el);
      }}
    >
      {(ref, leaved) =>
        children((instance) => {
          el.current = instance;
          ref(instance);
        }, leaved)
      }
    </Transition>
  );
}
