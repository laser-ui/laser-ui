import type { Styled } from '../../hooks/useStyled';
import type { CLASSES } from '../vars';

import { CollapseTransition } from '../../internal/transition';
import { mergeCS } from '../../utils';
import { TTANSITION_DURING_FAST } from '../../vars';

interface FormErrorProps {
  styled: Styled<typeof CLASSES>;
  visible: boolean;
  message: string;
  invalid: 'warning' | 'error';
  afterLeave: () => void;
}

export function FormError(props: FormErrorProps): JSX.Element | null {
  const { styled, visible, message, invalid, afterLeave } = props;

  return (
    <CollapseTransition
      originalSize={{
        height: 'auto',
      }}
      collapsedSize={{
        height: 0,
      }}
      enter={visible}
      during={TTANSITION_DURING_FAST}
      styles={{
        enter: { opacity: 0 },
        entering: {
          transition: ['height', 'padding', 'margin', 'opacity'].map((attr) => `${attr} ${TTANSITION_DURING_FAST}ms linear`).join(', '),
        },
        leaving: {
          opacity: 0,
          transition: ['height', 'padding', 'margin', 'opacity'].map((attr) => `${attr} ${TTANSITION_DURING_FAST}ms linear`).join(', '),
        },
        leaved: { display: 'none' },
      }}
      skipFirstTransition={false}
      afterLeave={afterLeave}
    >
      {(ref, collapseStyle) => (
        <div
          {...mergeCS(styled('form__error', `form__error--${invalid}`), {
            style: collapseStyle,
          })}
          ref={ref}
          title={message}
        >
          {message}
        </div>
      )}
    </CollapseTransition>
  );
}
