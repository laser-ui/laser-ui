import type { BadgeProps } from './types';

import { useEffect, useRef } from 'react';

import { BadgeText } from './BadgeText';
import { BadgeNumber } from './internal/BadgeNumber';
import { CLASSES } from './vars';
import { useComponentProps, useNamespace, useStyled } from '../hooks';
import { Transition } from '../transition';
import { mergeCS } from '../utils';

export const Badge: {
  (props: BadgeProps): React.ReactElement | null;
  Text: typeof BadgeText;
} = (props) => {
  const {
    styleOverrides,
    styleProvider,
    value: valueProp,
    theme = 'danger',
    max = Infinity,
    dot = false,
    showZero = false,
    offset = [0, '100%'],
    alone = false,

    ...restProps
  } = useComponentProps('Badge', props);

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { badge: styleProvider?.badge }, styleOverrides);

  const rootEl = useRef<HTMLDivElement>(null);

  const valueSaved = useRef<number>(undefined);

  const show = showZero || valueProp > 0;
  const value = show ? valueProp : (valueSaved.current ?? 0);

  const num = value > max ? max : value;

  useEffect(() => {
    valueSaved.current = value;
  });

  return (
    <Transition
      enter={show}
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
              'badge--dot': dot,
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
          title={restProps.title ?? (dot ? undefined : valueProp.toString())}
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
            {dot ? null : (
              <>
                {num
                  .toString()
                  .split('')
                  .map((n, i, arr) => (
                    <BadgeNumber key={arr.length - i} styled={styled} value={Number(n)} num={num} />
                  ))}
                {value > max ? '+' : ''}
              </>
            )}
          </div>
        </div>
      )}
    </Transition>
  );
};

Badge.Text = BadgeText;
