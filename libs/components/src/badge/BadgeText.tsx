import type { BadgeTextProps } from './types';

import { CLASSES } from './vars';
import { useComponentProps, useStyled } from '../hooks';
import { Transition } from '../internal/transition';
import { mergeCS } from '../utils';
import { TTANSITION_DURING_BASE } from '../vars';

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

  const styled = useStyled(CLASSES, { badge: styleProvider?.badge }, styleOverrides);

  return (
    <Transition enter={text.length > 0} during={TTANSITION_DURING_BASE}>
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
            title={restProps.title ?? text}
          >
            <div {...mergeCS(styled('badge__wrapper'), { style: transitionStyle })}>{text}</div>
          </div>
        );
      }}
    </Transition>
  );
}
