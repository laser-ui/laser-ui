import type { FabProps } from './types';

import { has } from 'lodash';

import { FabBacktop } from './FabBacktop';
import { FabButton } from './FabButton';
import { CLASSES, FabContext, FabListContext } from './vars';
import { useComponentProps, useControlled, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export const Fab: {
  (props: FabProps): React.ReactElement | null;
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
      <FabContext
        value={{
          expand,
          onClick: () => {
            if (list) {
              changeExpand((prev) => !prev);
            }
          },
        }}
      >
        {children}
      </FabContext>
      {expand &&
        list &&
        list.map(({ placement, actions }) => (
          <div key={placement} {...styled('fab__actions', `fab__actions--${placement}`)}>
            {actions.map((node, index) => {
              const { id, action } = (has(node, ['id', 'action']) ? node : { id: index, action: node }) as {
                id: React.Key;
                action: React.ReactNode;
              };
              return (
                <FabListContext
                  key={id}
                  value={{
                    index,
                    onClick: () => {
                      changeExpand(false);
                    },
                  }}
                >
                  {action}
                </FabListContext>
              );
            })}
          </div>
        ))}
    </div>
  );
};

Fab.Button = FabButton;
Fab.Backtop = FabBacktop;
