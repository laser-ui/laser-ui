import type { SwitchProps } from './types';

import { checkNodeExist } from '@laser-ui/utils';

import { CLASSES, TTANSITION_DURING } from './vars';
import { useComponentProps, useControlled, useDesign, useNamespace, useScopedProps, useStyled } from '../hooks';
import { Icon } from '../icon';
import { CircularProgress } from '../internal/circular-progress';
import { Transition } from '../transition';
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
    inputProps,
    onModelChange,

    ...restProps
  } = useComponentProps('Switch', props);

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { switch: styleProvider?.switch }, styleOverrides);

  const [checked, changeChecked] = useControlled(defaultModel ?? false, model, onModelChange, undefined, formControl?.control);

  const { size, disabled } = useScopedProps({ size: sizeProp, disabled: disabledProp || formControl?.control.disabled });

  const designProps = useDesign({ compose: { active: checked, disabled } });

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
        <input
          {...inputProps}
          {...styled('switch__input')}
          {...formControl?.inputAria}
          type="checkbox"
          disabled={disabled}
          role="switch"
          aria-checked={checked}
          onChange={() => {
            changeChecked((draft) => !draft);
          }}
        />
        <Transition
          enter={checked}
          name={`${namespace}-switch`}
          duration={TTANSITION_DURING}
          onSkipEnter={(el) => {
            if (el) {
              el.style.left = '';
              el.style.right = '2px';
            }
          }}
          onAfterEnter={(el) => {
            if (el) {
              el.style.left = '';
              el.style.right = '2px';
            }
          }}
          onSkipLeave={(el) => {
            if (el) {
              el.style.left = '2px';
              el.style.right = '';
            }
          }}
          onAfterLeave={(el) => {
            if (el) {
              el.style.left = '2px';
              el.style.right = '';
            }
          }}
        >
          {(transitionRef) => (
            <div
              {...styled('switch__state-dot')}
              ref={(instance) => {
                transitionRef(instance);
                return () => {
                  transitionRef(null);
                };
              }}
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
