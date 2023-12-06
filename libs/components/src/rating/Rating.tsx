import type { RatingProps } from './types';

import { checkNodeExist } from '@laser-ui/utils';
import StarFilled from '@material-design-icons/svg/filled/star.svg?react';
import { isFunction } from 'lodash';
import { useId, useState } from 'react';

import { RatingStar } from './internal/RatingStar';
import { CLASSES } from './vars';
import { useComponentProps, useControlled, useScopedProps, useStyled } from '../hooks';
import { Icon } from '../icon';
import { mergeCS } from '../utils';

export function Rating(props: RatingProps): JSX.Element | null {
  const {
    styleOverrides,
    styleProvider,
    formControl,
    model,
    defaultModel,
    total = 5,
    icon,
    tooltip,
    name,
    half = false,
    readOnly = false,
    disabled: disabledProp = false,
    onModelChange,

    ...restProps
  } = useComponentProps('Rating', props);

  const styled = useStyled(CLASSES, { rating: styleProvider?.rating }, styleOverrides);

  const uniqueId = useId();

  const [hover, setHover] = useState<number | null>(null);

  const [value, changeValue] = useControlled(defaultModel ?? null, model, onModelChange, undefined, formControl?.control);

  const { disabled } = useScopedProps({ disabled: disabledProp || formControl?.control.disabled });

  return (
    <div
      {...restProps}
      {...mergeCS(
        styled('rating', {
          'rating.is-disabled': disabled,
          'rating--read-only': readOnly,
        }),
        {
          className: restProps.className,
          style: restProps.style,
        },
      )}
      role="radiogroup"
      onMouseLeave={(e) => {
        restProps.onMouseLeave?.(e);

        setHover(null);
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <RatingStar
          key={i + 1}
          styled={styled}
          value={i + 1}
          hover={hover}
          checked={value}
          icon={
            isFunction(icon) ? (
              icon(i + 1)
            ) : checkNodeExist(icon) ? (
              icon
            ) : (
              <Icon>
                <StarFilled />
              </Icon>
            )
          }
          tooltip={tooltip}
          name={name ?? uniqueId}
          half={half}
          disabled={disabled || readOnly}
          inputProps={formControl?.inputAria}
          onCheck={(v) => {
            changeValue(v);
          }}
          onHoverChange={(v) => {
            setHover(v);
          }}
        />
      ))}
    </div>
  );
}
