import type { IconProps } from './types';

import { isArray, isNumber, isUndefined } from 'lodash';

import { CLASSES } from './vars';
import { useComponentProps, useNamespace, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export function Icon(props: IconProps): React.ReactElement | null {
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
      <div
        style={{
          width,
          height,
          transform: isUndefined(rotate) ? children.props.style?.transform : `rotate(${rotate}deg)`,
          animation: spin
            ? `${namespace}-spin ${spinSpeed}${isNumber(spinSpeed) ? 's' : ''} linear infinite`
            : children.props.style?.animation,
        }}
      >
        {children}
      </div>
    </div>
  );
}
