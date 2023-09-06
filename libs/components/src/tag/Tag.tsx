import type { TagProps } from './types';

import { CLASSES } from './vars';
import { useComponentProps, useScopedProps, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export function Tag(props: TagProps): JSX.Element | null {
  const {
    children,
    styleOverrides,
    styleProvider,
    pattern = 'primary',
    theme,
    size: sizeProp,

    ...restProps
  } = useComponentProps('Tag', props);

  const styled = useStyled(CLASSES, { tag: styleProvider?.tag }, styleOverrides);

  const { size } = useScopedProps({ size: sizeProp });

  return (
    <div
      {...restProps}
      {...mergeCS(
        styled('tag', `tag--${pattern}`, `tag--${size}`, {
          [`tag.t-${theme}`]: theme,
        }),
        {
          className: restProps.className,
          style: restProps.style,
        },
      )}
    >
      {children}
    </div>
  );
}
