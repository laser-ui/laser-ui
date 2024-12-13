import type { ButtonProps } from './types';
import type { WaveRef } from '../internal/wave';

import { checkNodeExist } from '@laser-ui/utils';
import { forwardRef, useRef } from 'react';

import { CLASSES } from './vars';
import { useComponentProps, useDesign, useScopedProps, useStyled } from '../hooks';
import { Icon } from '../icon';
import { CircularProgress } from '../internal/circular-progress';
import { CollapseTransition } from '../internal/transition';
import { Wave } from '../internal/wave';
import { mergeCS } from '../utils';
import { TTANSITION_DURING_SLOW } from '../vars';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref): React.ReactElement | null => {
  const {
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
        <CollapseTransition
          originalSize={{
            width: '',
          }}
          collapsedSize={{
            width: 0,
          }}
          enter={loading}
          during={TTANSITION_DURING_SLOW}
          styles={{
            entering: {
              transition: ['width', 'padding', 'margin'].map((attr) => `${attr} ${TTANSITION_DURING_SLOW}ms linear`).join(', '),
            },
            leaving: {
              transition: ['width', 'padding', 'margin'].map((attr) => `${attr} ${TTANSITION_DURING_SLOW}ms linear`).join(', '),
            },
            leaved: { display: 'none' },
          }}
          destroyWhenLeaved
        >
          {(loadingRef, collapseStyle) => (
            <div
              {...mergeCS(styled('button__icon'), {
                style: collapseStyle,
              })}
              ref={loadingRef}
            >
              <Icon>
                <CircularProgress />
              </Icon>
            </div>
          )}
        </CollapseTransition>
      )}
      <div>{children}</div>
    </button>
  );
});
