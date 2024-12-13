import type { AvatarProps } from './types';

import { toPx } from '@laser-ui/utils';
import { isNumber } from 'lodash';
import { useEffect, useRef, useState } from 'react';

import { CLASSES } from './vars';
import { useComponentProps, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export function Avatar(props: AvatarProps): React.ReactElement | null {
  const {
    styleOverrides,
    styleProvider,
    shape = 'circle',
    img,
    icon,
    text,
    size = 40,

    ...restProps
  } = useComponentProps('Avatar', props);

  const styled = useStyled(CLASSES, { avatar: styleProvider?.avatar }, styleOverrides);

  const textRef = useRef<HTMLDivElement>(null);

  const [imgError, setImgError] = useState(false);
  const type: 'img' | 'icon' | 'text' = img && !imgError ? 'img' : icon ? 'icon' : text ? 'text' : 'img';

  useEffect(() => {
    if (textRef.current) {
      const maxWidth =
        Math.sqrt(Math.pow((isNumber(size) ? size : toPx(size, true)) / 2, 2) - Math.pow(textRef.current.scrollHeight / 2, 2)) * 2;
      if (textRef.current.scrollWidth > maxWidth) {
        textRef.current.style.transform = `scale(${maxWidth / textRef.current.scrollWidth})`;
      } else {
        textRef.current.style.transform = '';
      }
    }
  });

  return (
    <div
      {...restProps}
      {...mergeCS(styled('avatar', `avatar--${type}`, `avatar--${shape}`), {
        className: restProps.className,
        style: {
          ...restProps.style,
          width: size,
          height: size,
          fontSize:
            type === 'icon'
              ? `calc((${size}${isNumber(size) ? 'px' : ''} / 2) * 1.25)`
              : type === 'text'
                ? `calc(${size}${isNumber(size) ? 'px' : ''} / 2)`
                : undefined,
        },
      })}
    >
      {type === 'img' ? (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img
          {...img}
          {...mergeCS(styled('avatar__img'), {
            className: img?.className,
            style: img?.style,
          })}
          onError={(e) => {
            img?.onError?.(e);

            setImgError(true);
          }}
        />
      ) : type === 'icon' ? (
        icon
      ) : (
        <div ref={textRef}>{text}</div>
      )}
    </div>
  );
}
