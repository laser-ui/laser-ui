import type { ImageActionProps } from './types';

import { CLASSES } from './vars';
import { useComponentProps, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export function ImageAction(props: ImageActionProps): React.ReactElement | null {
  const {
    ref,
    children,
    styleOverrides,
    styleProvider,

    ...restProps
  } = useComponentProps('ImageAction', props);

  const styled = useStyled(CLASSES, { image: styleProvider?.image }, styleOverrides);

  return (
    <button
      {...restProps}
      {...mergeCS(styled('image__action'), {
        className: restProps.className,
        style: restProps.style,
      })}
      ref={ref}
      type={restProps['type'] ?? 'button'}
    >
      {children}
    </button>
  );
}
