import type { CardProps } from './types';

import { CardAction } from './CardAction';
import { CardActions } from './CardActions';
import { CardContent } from './CardContent';
import { CardHeader } from './CardHeader';
import { CLASSES } from './vars';
import { useComponentProps, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export const Card: {
  (props: CardProps): JSX.Element | null;
  Header: typeof CardHeader;
  Content: typeof CardContent;
  Actions: typeof CardActions;
  Action: typeof CardAction;
} = (props) => {
  const {
    children,
    styleOverrides,
    styleProvider,
    shadow = false,

    ...restProps
  } = useComponentProps('Card', props);

  const styled = useStyled(CLASSES, { card: styleProvider?.card }, styleOverrides);

  return (
    <div
      {...restProps}
      {...mergeCS(
        styled('card', {
          'card--shadow': shadow === true,
          'card--shadow-hover': shadow === 'hover',
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
};

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Actions = CardActions;
Card.Action = CardAction;
