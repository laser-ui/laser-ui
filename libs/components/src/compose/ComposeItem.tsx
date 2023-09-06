import type { ComposeItemProps } from './types';

import { CLASSES } from './vars';
import { useComponentProps, useDesign, useScopedProps, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export function ComposeItem(props: ComposeItemProps): JSX.Element | null {
  const {
    children,
    styleOverrides,
    styleProvider,
    gray = false,

    ...restProps
  } = useComponentProps('ComposeItem', props);

  const styled = useStyled(CLASSES, { compose: styleProvider?.compose }, styleOverrides);

  const { size, disabled } = useScopedProps({});

  const designProps = useDesign({ compose: { disabled } });

  return (
    <div
      {...restProps}
      {...mergeCS(
        styled('compose__item', `compose__item--${size}`, {
          'compose__item--gray': gray,
          'compose__item.is-disabled': disabled,
        }),
        {
          className: restProps.className,
          style: restProps.style,
        },
      )}
      {...designProps}
    >
      {children}
    </div>
  );
}
