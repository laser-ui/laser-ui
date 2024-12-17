import type { Styled } from '../../hooks/useStyled';
import type { CLASSES } from '../vars';

import { CollapseTransition } from '../../transition';
import { mergeCS } from '../../utils';
import { TTANSITION_DURING_FAST } from '../../vars';

interface FormErrorProps {
  namespace: string;
  styled: Styled<typeof CLASSES>;
  visible: boolean;
  message: string;
  invalid: 'warning' | 'error';
  afterLeave: () => void;
}

export function FormError(props: FormErrorProps): React.ReactElement | null {
  const { namespace, styled, visible, message, invalid, afterLeave } = props;

  return (
    <CollapseTransition
      height={0}
      enter={visible}
      name={`${namespace}-form-error`}
      duration={TTANSITION_DURING_FAST}
      skipFirstTransition={false}
      onAfterLeave={afterLeave}
    >
      {(transitionRef, leaved) => (
        <div
          {...mergeCS(styled('form__error', `form__error--${invalid}`), {
            style: { ...(leaved ? { display: 'none' } : undefined) },
          })}
          ref={(instance) => {
            transitionRef(instance);
            return () => {
              transitionRef(null);
            };
          }}
          title={message}
        >
          {message}
        </div>
      )}
    </CollapseTransition>
  );
}
