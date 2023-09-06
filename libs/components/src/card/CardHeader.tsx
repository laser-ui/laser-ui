import type { CardHeaderProps } from './types';

import { CLASSES } from './vars';
import { useComponentProps, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export function CardHeader(props: CardHeaderProps): JSX.Element | null {
  const {
    styleOverrides,
    styleProvider,
    children,
    action,

    ...restProps
  } = useComponentProps('CardHeader', props);

  const styled = useStyled(CLASSES, { card: styleProvider?.card }, styleOverrides);

  return (
    <div
      {...restProps}
      {...mergeCS(styled('card__header'), {
        className: restProps.className,
        style: restProps.style,
      })}
    >
      <div {...styled('card__header-title')}>{children}</div>
      <div {...styled('card__header-action')}>{action}</div>
    </div>
  );
}
