import type { MaskProps } from './types';
import type { TransitionState } from '../transition/types';

import { CLASSES } from './vars';
import { useStyled } from '../../hooks';
import { mergeCS } from '../../utils';
import { TTANSITION_DURING_FAST } from '../../vars';
import { Transition } from '../transition';

export function Mask(props: MaskProps): JSX.Element | null {
  const {
    visible,
    onClose,
    afterVisibleChange,

    ...restProps
  } = props;

  const styled = useStyled(CLASSES, { mask: undefined });

  const transitionStyles: Partial<Record<TransitionState, React.CSSProperties>> = {
    enter: { opacity: 0 },
    entering: {
      transition: ['opacity'].map((attr) => `${attr} ${TTANSITION_DURING_FAST}ms linear`).join(', '),
    },
    leaving: {
      opacity: 0,
      transition: ['opacity'].map((attr) => `${attr} ${TTANSITION_DURING_FAST}ms linear`).join(', '),
    },
    leaved: { display: 'none' },
  };

  return (
    <Transition
      enter={visible}
      during={TTANSITION_DURING_FAST}
      // TODO: Should it be controllable?
      skipFirstTransition={false}
      afterEnter={() => {
        afterVisibleChange?.(true);
      }}
      afterLeave={() => {
        afterVisibleChange?.(false);
      }}
    >
      {(state) => (
        <div
          {...restProps}
          {...mergeCS(styled('mask'), {
            className: restProps.className,
            style: {
              ...restProps.style,
              ...transitionStyles[state],
            },
          })}
          onClick={(e) => {
            restProps.onClick?.(e);

            onClose?.();
          }}
        />
      )}
    </Transition>
  );
}
