import type { IconProps } from './types';

import { isArray, isNumber, isUndefined } from 'lodash';
import { cloneElement } from 'react';

import { CLASSES } from './vars';
import { useComponentProps, useNamespace, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export function Icon(props: IconProps): JSX.Element | null {
  const {
    children,
    styleOverrides,
    styleProvider,
    size = '1em',
    theme,
    rotate,
    spin,
    spinSpeed = 1,

    ...restProps
  } = useComponentProps('Icon', props);

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { icon: styleProvider?.icon }, styleOverrides);

  const [width, height] = isArray(size) ? size : [size, size];

  return (
    <div
      {...restProps}
      {...mergeCS(styled('icon', { [`icon.t-${theme}`]: theme }), {
        className: restProps.className,
        style: restProps.style,
      })}
    >
      {cloneElement(children, {
        ...children.props,
        style: {
          ...children.props.style,
          transform: isUndefined(rotate) ? undefined : `rotate(${rotate}deg)`,
          animation: spin ? `${namespace}-spin ${spinSpeed}${isNumber(spinSpeed) ? 's' : ''} linear infinite` : undefined,
        },
        fill: 'currentColor',
        width,
        height,
      })}
    </div>
  );
}
