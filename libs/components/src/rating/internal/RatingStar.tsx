import type { Styled } from '../../hooks/useStyled';
import type { CLASSES } from '../vars';

import { isUndefined } from 'lodash';
import { useId, useState } from 'react';

import { useNamespace } from '../../hooks';
import { Tooltip } from '../../tooltip';

interface RatingStarProps {
  styled: Styled<typeof CLASSES>;
  value: number;
  hover: number | null;
  checked: number | null;
  icon: React.ReactNode;
  tooltip: ((value: number) => React.ReactNode) | undefined;
  name: string;
  half: boolean;
  disabled: boolean;
  inputProps: any;
  onCheck: (value: number) => void;
  onHoverChange: (value: number) => void;
}

export function RatingStar(props: RatingStarProps): JSX.Element | null {
  const { styled, value, hover, checked: checkedProp, icon, tooltip, name, half, disabled, inputProps, onCheck, onHoverChange } = props;

  const namespace = useNamespace();

  const uniqueId = useId();
  const inputId = `${namespace}-rating-star-input-${uniqueId}`;
  const halfInputId = `${namespace}-rating-star-half-input-${uniqueId}`;

  const checked = value === checkedProp;

  const halfValue = value - 0.5;
  const halfChecked = halfValue === checkedProp;

  const [tooltipValue, setTooltipValue] = useState<number>(value);

  const node = (
    <div {...styled('rating__star')}>
      {half && (
        <>
          <input
            {...styled('rating__input', 'rating__input--half')}
            {...inputProps}
            id={halfInputId}
            type="radio"
            name={name}
            checked={halfChecked}
            disabled={disabled}
            aria-checked={halfChecked}
            onChange={() => {
              onCheck(halfValue);
            }}
            onMouseEnter={() => {
              if (!isUndefined(tooltip)) {
                setTooltipValue(halfValue);
              }

              onHoverChange(halfValue);
            }}
          />
          <label
            {...styled('rating__icon', 'rating__icon--half', {
              'rating__icon.is-checked': halfValue <= (hover ?? checkedProp ?? 0),
            })}
            htmlFor={halfInputId}
          >
            {icon}
          </label>
        </>
      )}
      <label
        {...styled('rating__icon', {
          'rating__icon.is-checked': value <= (hover ?? checkedProp ?? 0),
        })}
      >
        <input
          {...styled('rating__input')}
          id={inputId}
          type="radio"
          name={name}
          checked={checked}
          disabled={disabled}
          aria-checked={checked}
          onChange={() => {
            onCheck(value);
          }}
          onMouseEnter={() => {
            if (!isUndefined(tooltip)) {
              setTooltipValue(value);
            }

            onHoverChange(value);
          }}
        />
        {icon}
      </label>
    </div>
  );

  return isUndefined(tooltip) ? node : <Tooltip title={tooltip?.(tooltipValue)}>{node}</Tooltip>;
}
