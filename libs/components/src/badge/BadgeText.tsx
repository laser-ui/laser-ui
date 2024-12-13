import type { BadgeTextProps } from './types';

import { CLASSES } from './vars';
import { useComponentProps, useNamespace, useStyled } from '../hooks';
import { Transition } from '../transition';
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

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { badge: styleProvider?.badge }, styleOverrides);

  return (
    <Transition enter={text.length > 0} name={`${namespace}-badge`} duration={TTANSITION_DURING_BASE}>
      {(transitionRef, leaved) => (
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
                ...(leaved ? { display: 'none' } : undefined),
              },
            },
          )}
          title={restProps.title ?? text}
        >
          <div
            {...styled('badge__wrapper')}
            ref={(instance) => {
              transitionRef(instance);
              return () => {
                transitionRef(null);
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
