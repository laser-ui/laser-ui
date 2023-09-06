import type { CardProps } from './types';

import { isString } from 'lodash';
import { Children } from 'react';

import { CardAction } from './CardAction';
import { CardContent } from './CardContent';
import { CardHeader } from './CardHeader';
import { CLASSES } from './vars';
import { useComponentProps, useStyled } from '../hooks';
import { Separator } from '../separator';
import { mergeCS } from '../utils';

export const Card: {
  (props: CardProps): JSX.Element | null;
  Header: typeof CardHeader;
  Content: typeof CardContent;
  Action: typeof CardAction;
} = (props) => {
  const {
    children,
    styleOverrides,
    styleProvider,
    shadow = false,
    header: headerProp,
    actions,

    ...restProps
  } = useComponentProps('Card', props);

  const styled = useStyled(CLASSES, { card: styleProvider?.card }, styleOverrides);

  const headerNode = (() => {
    if (headerProp) {
      return isString(headerProp) ? <CardHeader>{headerProp}</CardHeader> : headerProp;
    }
  })();

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
      {headerNode}
      {children}
      {actions && (
        <div {...styled('card__actions')}>
          {Children.map(actions, (action, index) => (
            <>
              {action}
              {index !== actions.length - 1 && <Separator style={{ margin: 8 }} vertical></Separator>}
            </>
          ))}
        </div>
      )}
    </div>
  );
};

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Action = CardAction;
