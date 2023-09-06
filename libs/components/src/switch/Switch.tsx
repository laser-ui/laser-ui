import type { SwitchProps } from './types';
import type { TransitionState } from '../internal/transition/types';

import { checkNodeExist } from '@laser-ui/utils';

import { CLASSES, TTANSITION_DURING } from './vars';
import { useComponentProps, useControlled, useDesign, useScopedProps, useStyled } from '../hooks';
import { Icon } from '../icon';
import { CircularProgress } from '../internal/circular-progress';
import { Transition } from '../internal/transition';
import { mergeCS } from '../utils';

export function Switch(props: SwitchProps) {
  const {
    children,
    styleOverrides,
    styleProvider,
    formControl,
    model,
    defaultModel,
    stateContent,
    labelPlacement = 'right',
    size: sizeProp,
    loading = false,
    disabled: disabledProp = false,
    inputRef,
    inputRender,
    onModelChange,

    ...restProps
  } = useComponentProps('Switch', props);

  const styled = useStyled(CLASSES, { switch: styleProvider?.switch }, styleOverrides);

  const [checked, changeChecked] = useControlled(defaultModel ?? false, model, onModelChange, undefined, formControl?.control);

  const { size, disabled } = useScopedProps({ size: sizeProp, disabled: disabledProp || formControl?.control.disabled });

  const designProps = useDesign({ compose: { active: checked, disabled } });

  const transitionStyles: Partial<Record<TransitionState, React.CSSProperties>> = {
    enter: { left: 2 },
    entering: {
      left: 'calc(100% - 20px)',
      transition: ['width', 'padding', 'margin', 'left'].map((attr) => `${attr} ${TTANSITION_DURING}ms linear`).join(', '),
    },
    entered: { right: 2 },
    leave: { right: 2 },
    leaving: {
      right: 'calc(100% - 20px)',
      transition: ['width', 'padding', 'margin', 'right'].map((attr) => `${attr} ${TTANSITION_DURING}ms linear`).join(', '),
    },
    leaved: { left: 2 },
  };

  const inputNode = (
    <input
      {...styled('switch__input')}
      {...formControl?.inputAria}
      ref={inputRef}
      type="checkbox"
      disabled={disabled}
      role="switch"
      aria-checked={checked}
      onChange={() => {
        changeChecked((draft) => !draft);
      }}
    />
  );

  return (
    <label
      {...restProps}
      {...mergeCS(
        styled('switch', `switch--${size}`, {
          'switch--label-left': labelPlacement === 'left',
          'switch.is-checked': checked,
          'switch.is-loading': loading,
          'switch.is-disabled': disabled,
        }),
        {
          className: restProps.className,
          style: restProps.style,
        },
      )}
      {...designProps}
    >
      <div {...styled('switch__state-container')}>
        {stateContent && (
          <>
            {checkNodeExist(stateContent[0]) && (
              <div
                {...mergeCS(styled('switch__state-content', 'switch__state-content--left'), {
                  style: { opacity: checked ? 1 : 0 },
                })}
              >
                {stateContent[0]}
              </div>
            )}
            {checkNodeExist(stateContent[1]) && (
              <div
                {...mergeCS(styled('switch__state-content'), {
                  style: { opacity: checked ? 0 : 1 },
                })}
              >
                {stateContent[1]}
              </div>
            )}
          </>
        )}
        {inputRender ? inputRender(inputNode) : inputNode}
        <Transition enter={checked} during={TTANSITION_DURING}>
          {(state) => (
            <div
              {...mergeCS(styled('switch__state-dot'), {
                style: transitionStyles[state],
              })}
            >
              {loading && (
                <Icon>
                  <CircularProgress />
                </Icon>
              )}
            </div>
          )}
        </Transition>
      </div>
      {checkNodeExist(children) && <div {...styled('switch__label')}>{children}</div>}
    </label>
  );
}
