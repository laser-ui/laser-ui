import type { TableExpandProps } from './types';

import { CLASSES } from './vars';
import { useComponentProps, useControlled, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export function TableExpand(props: TableExpandProps): JSX.Element | null {
  const {
    styleOverrides,
    styleProvider,
    expand: expandProp,
    onExpandChange,

    ...restProps
  } = useComponentProps('TableExpand', props);

  const styled = useStyled(CLASSES, { table: styleProvider?.table }, styleOverrides);

  const [expand, changeExpand] = useControlled<boolean>(false, expandProp, onExpandChange);

  return (
    <button
      {...restProps}
      {...mergeCS(
        styled('table__expand', {
          'table__expand.is-expand': expand,
        }),
        {
          className: restProps.className,
          style: restProps.style,
        },
      )}
      onClick={(e) => {
        restProps.onClick?.(e);

        changeExpand((draft) => !draft);
      }}
    />
  );
}
