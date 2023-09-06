import type { SeparatorProps } from './types';

import { checkNodeExist } from '@laser-ui/utils';

import { CLASSES } from './vars';
import { useComponentProps, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export function Separator(props: SeparatorProps): JSX.Element | null {
  const {
    children,
    styleOverrides,
    styleProvider,
    textAlign = 'left',
    vertical = false,

    ...restProps
  } = useComponentProps('Separator', props);

  const styled = useStyled(CLASSES, { separator: styleProvider?.separator }, styleOverrides);

  const hasText = checkNodeExist(children);

  return (
    <div
      {...restProps}
      {...mergeCS(
        styled('separator', {
          'separator--text': hasText,
          [`separator--text-${textAlign}`]: hasText,
          'separator--vertical': vertical,
        }),
        {
          className: restProps.className,
          style: restProps.style,
        },
      )}
      role="separator"
      aria-orientation={vertical ? 'vertical' : 'horizontal'}
    >
      {hasText && <div {...styled('separator__text')}>{children}</div>}
    </div>
  );
}
