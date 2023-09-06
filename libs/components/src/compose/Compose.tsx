import type { ComposeProps } from './types';
import type { LContextIn } from '../context';

import { useMemo } from 'react';

import { ComposeItem } from './ComposeItem';
import { CLASSES } from './vars';
import { ConfigProvider } from '../config-provider';
import { useComponentProps, useScopedProps, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export const Compose: {
  (props: ComposeProps): JSX.Element | null;
  Item: typeof ComposeItem;
} = (props) => {
  const {
    children,
    styleOverrides,
    styleProvider,
    size: sizeProp,
    vertical = false,
    disabled: disabledProp = false,

    ...restProps
  } = useComponentProps('Compose', props);

  const styled = useStyled(CLASSES, { compose: styleProvider?.compose }, styleOverrides);

  const { size, disabled } = useScopedProps({ size: sizeProp, disabled: disabledProp });

  const lContext = useMemo<LContextIn>(
    () => ({
      componentSize: size,
      componentDisabled: disabled,
    }),
    [disabled, size],
  );

  return (
    <div
      {...restProps}
      {...mergeCS(
        styled('compose', {
          'compose--vertical': vertical,
        }),
        {
          className: restProps.className,
          style: restProps.style,
        },
      )}
    >
      <ConfigProvider context={lContext}>{children}</ConfigProvider>
    </div>
  );
};

Compose.Item = ComposeItem;
