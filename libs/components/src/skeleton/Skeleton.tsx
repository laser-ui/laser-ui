import type { SkeletonProps } from './types';

import { CLASSES } from './vars';
import { useComponentProps, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export function Skeleton(props: SkeletonProps): JSX.Element | null {
  const {
    children,
    styleOverrides,
    styleProvider,
    pattern = 'text',

    ...restProps
  } = useComponentProps('Skeleton', props);

  const styled = useStyled(CLASSES, { skeleton: styleProvider?.skeleton }, styleOverrides);

  return (
    <div
      {...restProps}
      {...mergeCS(styled('skeleton', `skeleton--${pattern}`), {
        className: restProps.className,
        style: restProps.style,
      })}
    >
      {children}
    </div>
  );
}
