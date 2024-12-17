import type { MaskProps } from './types';

import { CLASSES } from './vars';
import { useNamespace, useStyled } from '../hooks';
import { Transition } from '../transition';
import { mergeCS } from '../utils';
import { TTANSITION_DURING_FAST } from '../vars';

export function Mask(props: MaskProps): React.ReactElement | null {
  const {
    visible,
    onClose,
    afterVisibleChange,

    ...restProps
  } = props;

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { mask: undefined });

  return (
    <Transition
      enter={visible}
      name={`${namespace}-fade`}
      duration={TTANSITION_DURING_FAST}
      // TODO: Should it be controllable?
      skipFirstTransition={false}
      onAfterEnter={() => {
        afterVisibleChange?.(true);
      }}
      onAfterLeave={() => {
        afterVisibleChange?.(false);
      }}
    >
      {(transitionRef, leaved) => (
        <div
          {...restProps}
          {...mergeCS(styled('mask'), {
            className: restProps.className,
            style: {
              ...restProps.style,
              ...{ '--fade-duration': TTANSITION_DURING_FAST + 'ms' },
              ...(leaved ? { display: 'none' } : undefined),
            },
          })}
          ref={(instance) => {
            transitionRef(instance);
            return () => {
              transitionRef(null);
            };
          }}
          onClick={(e) => {
            restProps.onClick?.(e);

            onClose?.();
          }}
        />
      )}
    </Transition>
  );
}
