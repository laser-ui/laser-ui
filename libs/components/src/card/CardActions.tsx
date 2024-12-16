import type { CardActionsProps } from './types';

import { has } from 'lodash';
import { Fragment } from 'react';

import { CLASSES } from './vars';
import { useComponentProps, useStyled } from '../hooks';
import { Separator } from '../separator';
import { mergeCS } from '../utils';

export function CardActions(props: CardActionsProps): React.ReactElement | null {
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
      {actions.map((node, index) => {
        const { id, action } = (has(node, ['id', 'action']) ? node : { id: index, action: node }) as {
          id: React.Key;
          action: React.ReactNode;
        };
        return (
          <Fragment key={id}>
            {action}
            {index !== actions.length - 1 && <Separator style={{ margin: 8 }} vertical />}
          </Fragment>
        );
      })}
    </div>
  );
}
