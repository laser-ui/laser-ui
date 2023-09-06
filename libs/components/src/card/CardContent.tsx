import type { CardContentProps } from './types';

import { CLASSES } from './vars';
import { useComponentProps, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export function CardContent(props: CardContentProps): JSX.Element | null {
  const {
    styleOverrides,
    styleProvider,
    children,

    ...restProps
  } = useComponentProps('CardContent', props);

  const styled = useStyled(CLASSES, { card: styleProvider?.card }, styleOverrides);

  return (
    <div
      {...restProps}
      {...mergeCS(styled('card__content'), {
        className: restProps.className,
        style: restProps.style,
      })}
    >
      {children}
    </div>
  );
}
