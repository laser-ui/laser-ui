import type { ButtonProps } from './types';
import type { WaveRef } from '../internal/wave';

import { checkNodeExist } from '@laser-ui/utils';
import { useRef } from 'react';

import { CLASSES } from './vars';
import { useComponentProps, useDesign, useScopedProps, useStyled } from '../hooks';
import { Icon } from '../icon';
import { CircularProgress } from '../internal/circular-progress';
import { Wave } from '../internal/wave';
import { CollapseTransition } from '../transition';
import { mergeCS } from '../utils';
import { TTANSITION_DURING_SLOW } from '../vars';

export function Button(props: ButtonProps) {
  const {
    ref,
    children,
    styleOverrides,
    styleProvider,
    pattern = 'primary',
    theme = 'primary',
    loading = false,
    shape,
    block = false,
    size: sizeProp,
    icon,
    iconRight = false,

    ...restProps
  } = useComponentProps('Button', props);

  const styled = useStyled(CLASSES, { button: styleProvider?.button }, styleOverrides);

  const waveRef = useRef<WaveRef>(null);

  const { size, disabled } = useScopedProps({ size: sizeProp, disabled: restProps.disabled || loading });

  const designProps = useDesign({ compose: { disabled } });

  return (
    <button
      {...restProps}
      {...mergeCS(
        styled('button', `button.t-${theme}`, `button--${pattern}`, `button--${size}`, {
          'button.is-loading': loading,
          [`button--${shape}`]: shape,
          'button--block': block,
          'button--icon': !children,
          'button--icon-right': iconRight,
        }),
        {
          className: restProps.className,
          style: restProps.style,
        },
      )}
      {...designProps}
      ref={ref}
      type={restProps.type ?? 'button'}
      disabled={disabled}
      onClick={(e) => {
        restProps.onClick?.(e);

        if (['primary', 'secondary', 'outline', 'dashed'].includes(pattern)) {
          waveRef.current?.();
        }
      }}
    >
      <Wave ref={waveRef} color="var(--color)" />
      {checkNodeExist(icon) ? (
        <div {...styled('button__icon')}>
          {loading ? (
            <Icon>
              <CircularProgress />
            </Icon>
          ) : (
            icon
          )}
        </div>
      ) : (
        <CollapseTransition enter={loading} duration={TTANSITION_DURING_SLOW}>
          {(transitionRef, leaved) =>
            leaved ? null : (
              <div ref={transitionRef} style={{ '--collapse-duration': TTANSITION_DURING_SLOW + 'ms' } as any}>
                <div {...styled('button__icon')}>
                  <Icon>
                    <CircularProgress />
                  </Icon>
                </div>
              </div>
            )
          }
        </CollapseTransition>
      )}
      <div>{children}</div>
    </button>
  );
}
