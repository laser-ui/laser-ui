import type { WaveProps } from './types';

import { useEventCallback } from '@laser-ui/hooks';
import { useImperativeHandle, useState } from 'react';

import { CLASSES } from './vars';
import { useNamespace, useStyled } from '../../hooks';
import { mergeCS } from '../../utils';

export function Wave(props: WaveProps): React.ReactElement | null {
  const {
    ref,
    color,

    ...restProps
  } = props;

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { wave: undefined });

  const [node, setNode] = useState<React.ReactElement | null>(null);

  const wave = useEventCallback(() => {
    setNode(
      <div
        {...restProps}
        {...mergeCS(styled('wave'), {
          className: restProps.className,
          style: {
            ...restProps.style,
            color,
          },
        })}
        key={Math.random()}
        onAnimationEnd={(e) => {
          if (e.animationName === `${namespace}-wave-fade-out`) {
            setNode(null);
          }
        }}
      />,
    );
  });

  useImperativeHandle(ref, () => wave, [wave]);

  return node;
}
