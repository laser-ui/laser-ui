import type { FabButtonProps, FabProps } from './types';

import { Children, cloneElement } from 'react';

import { FabBacktop } from './FabBacktop';
import { FabButton } from './FabButton';
import { CLASSES } from './vars';
import { useComponentProps, useControlled, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export const Fab: {
  (props: FabProps): JSX.Element | null;
  Button: typeof FabButton;
  Backtop: typeof FabBacktop;
} = (props) => {
  const {
    children,
    styleOverrides,
    styleProvider,
    expand: expandProp,
    defaultExpand,
    list,
    onExpandChange,

    ...restProps
  } = useComponentProps('Fab', props);

  const styled = useStyled(CLASSES, { fab: styleProvider?.fab }, styleOverrides);

  const [expand, changeExpand] = useControlled(defaultExpand ?? false, expandProp, onExpandChange);

  return (
    <div
      {...restProps}
      {...mergeCS(styled('fab'), {
        className: restProps.className,
        style: restProps.style,
      })}
    >
      {cloneElement<FabButtonProps>(children, {
        ...{ _expand: expand },
        onClick: (e) => {
          children.props.onClick?.(e);

          if (list) {
            changeExpand((draft) => !draft);
          }
        },
      })}
      {expand &&
        list &&
        list.map(({ placement, actions }, key) => (
          <div key={key} {...styled('fab__actions', `fab__actions--${placement}`)}>
            {Children.map(actions, (action, index) =>
              cloneElement<FabButtonProps>(action, {
                ...{ _action: true },
                style: {
                  ...action.props.style,
                  animationDelay: `${index * 33}ms`,
                },
                onClick: (e) => {
                  action.props.onClick?.(e);

                  changeExpand(false);
                },
              }),
            )}
          </div>
        ))}
    </div>
  );
};

Fab.Button = FabButton;
Fab.Backtop = FabBacktop;
