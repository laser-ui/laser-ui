import type { BadgeTextProps } from './types';

import { useRef } from 'react';

import { CLASSES } from './vars';
import { useComponentProps, useNamespace, useStyled } from '../hooks';
import { Transition } from '../transition';
import { mergeCS } from '../utils';

export function BadgeText(props: BadgeTextProps) {
  const {
    styleOverrides,
    styleProvider,
    text,
    theme = 'danger',
    offset = [0, '100%'],
    alone = false,

    ...restProps
  } = useComponentProps('BadgeText', props);

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { badge: styleProvider?.badge }, styleOverrides);

  const rootEl = useRef<HTMLDivElement>(null);

  return (
    <Transition
      enter={text.length > 0}
      name={`${namespace}-badge`}
      onBeforeEnter={() => {
        if (rootEl.current && rootEl.current.style.display === 'none') {
          rootEl.current.style.display = '';
        }
      }}
      onAfterLeave={() => {
        if (rootEl.current) {
          rootEl.current.style.display = 'none';
        }
      }}
    >
      {(transitionRef) => (
        <div
          {...restProps}
          {...mergeCS(
            styled('badge', `badge.t-${theme}`, {
              'badge--alone': alone,
            }),
            {
              className: restProps.className,
              style: {
                ...restProps.style,
                ...(alone ? undefined : { top: offset[0], left: offset[1] }),
              },
            },
          )}
          ref={rootEl}
          title={restProps.title ?? text}
        >
          <div
            {...styled('badge__wrapper')}
            ref={(el) => {
              transitionRef.current = el;
              return () => {
                transitionRef.current = null;
              };
            }}
          >
            {text}
          </div>
        </div>
      )}
    </Transition>
  );
}
