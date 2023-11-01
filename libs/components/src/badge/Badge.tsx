import type { BadgeProps } from './types';

import { useRef } from 'react';

import { BadgeText } from './BadgeText';
import { BadgeNumber } from './internal/BadgeNumber';
import { CLASSES } from './vars';
import { useComponentProps, useStyled } from '../hooks';
import { Transition } from '../internal/transition';
import { mergeCS } from '../utils';
import { TTANSITION_DURING_BASE } from '../vars';

export const Badge: {
  (props: BadgeProps): JSX.Element | null;
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

  const styled = useStyled(CLASSES, { badge: styleProvider?.badge }, styleOverrides);

  const dataRef = useRef<{
    saveValue?: number;
    prevValue: number;
    valueDown: boolean;
  }>({
    prevValue: valueProp,
    valueDown: false,
  });

  const show = showZero || valueProp > 0;
  const value = show ? valueProp : dataRef.current.saveValue ?? 0;
  dataRef.current.saveValue = value;

  const nums = (value > max ? max : value)
    .toString()
    .split('')
    .map((n) => Number(n));

  if (value !== dataRef.current.prevValue) {
    dataRef.current.valueDown = value < dataRef.current.prevValue;
    dataRef.current.prevValue = value;
  }

  return (
    <Transition enter={show} during={TTANSITION_DURING_BASE}>
      {(state) => {
        let transitionStyle: React.CSSProperties = {};
        switch (state) {
          case 'enter':
            transitionStyle = { transform: 'scale(0)', opacity: 0 };
            break;

          case 'entering':
            transitionStyle = {
              transition: ['transform', 'opacity'].map((attr) => `${attr} ${TTANSITION_DURING_BASE}ms ease-out`).join(', '),
            };
            break;

          case 'leaving':
            transitionStyle = {
              transform: 'scale(0)',
              opacity: 0,
              transition: ['transform', 'opacity'].map((attr) => `${attr} ${TTANSITION_DURING_BASE}ms ease-in`).join(', '),
            };
            break;

          default:
            break;
        }

        return state === 'leaved' ? null : (
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
            title={restProps.title ?? (dot ? undefined : valueProp.toString())}
          >
            <div {...mergeCS(styled('badge__wrapper'), { style: transitionStyle })}>
              {dot ? null : (
                <>
                  {nums.map((n, i) => (
                    <BadgeNumber key={nums.length - i} styled={styled} value={n} valueDown={dataRef.current.valueDown} />
                  ))}
                  {value > max ? '+' : ''}
                </>
              )}
            </div>
          </div>
        );
      }}
    </Transition>
  );
};

Badge.Text = BadgeText;
