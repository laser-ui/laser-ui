import type { CardActionsProps } from './types';

import { Children } from 'react';

import { CLASSES } from './vars';
import { useComponentProps, useStyled } from '../hooks';
import { Separator } from '../separator';
import { mergeCS } from '../utils';

export function CardActions(props: CardActionsProps): JSX.Element | null {
  const {
    styleOverrides,
    styleProvider,
    actions,

    ...restProps
  } = useComponentProps('CardActions', props);

  const styled = useStyled(CLASSES, { card: styleProvider?.card }, styleOverrides);

  return (
    <div
      {...restProps}
      {...mergeCS(styled('card__actions'), {
        className: restProps.className,
        style: restProps.style,
      })}
    >
      {Children.map(actions, (action, index) => (
        <>
          {action}
          {index !== actions.length - 1 && <Separator style={{ margin: 8 }} vertical />}
        </>
      ))}
    </div>
  );
}
