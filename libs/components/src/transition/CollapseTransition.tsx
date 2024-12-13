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
    onBeforeLeave,
    onAfterLeave,
    width = 0,
    height,

    ...restProps
  } = props;

  const namespace = useNamespace();

  const el = useRef<HTMLElement>(null);

  const calculateSize = (el: HTMLElement | null) => {
    if (el) {
      if (isNumber(height)) {
        el.style.setProperty(`--${namespace}-collapse-vertical-from`, el.offsetHeight + 'px');
        el.style.setProperty(`--${namespace}-collapse-vertical-to`, height + 'px');
      } else {
        console.log(el.offsetWidth);
        el.style.setProperty(`--${namespace}-collapse-horizontal-from`, el.offsetWidth + 'px');
        el.style.setProperty(`--${namespace}-collapse-horizontal-to`, width + 'px');
      }
    }
  };

  return (
    <Transition
      {...restProps}
      name={name ?? (isNumber(height) ? `${namespace}-collapse-vertical` : `${namespace}-collapse-horizontal`)}
      onBeforeEnter={(el) => {
        onBeforeEnter?.(el);
        calculateSize(el);
      }}
      onBeforeLeave={(el) => {
        onBeforeLeave?.(el);
        calculateSize(el);
      }}
      onAfterLeave={(el) => {
        onAfterLeave?.(el);
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
