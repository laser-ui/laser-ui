import type { ImageProps } from './types';

import { checkNodeExist } from '@laser-ui/utils';
import { has } from 'lodash';
import { Fragment, useState } from 'react';

import { ImageAction } from './ImageAction';
import { ImageLoader } from './ImageLoader';
import { ImagePreview } from './ImagePreview';
import { CLASSES } from './vars';
import { useComponentProps, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export const Image: {
  (props: ImageProps): React.ReactElement | null;
  Loader: typeof ImageLoader;
  Action: typeof ImageAction;
  Preview: typeof ImagePreview;
} = (props) => {
  const {
    styleOverrides,
    styleProvider,
    loading,
    error,
    actions,
    imgProps,

    ...restProps
  } = useComponentProps('Image', props);

  const styled = useStyled(CLASSES, { image: styleProvider?.image }, styleOverrides);

  const [previousSrc, setPreviousSrc] = useState(imgProps.src);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  if (imgProps.src !== previousSrc) {
    setPreviousSrc(imgProps.src);
    setIsLoading(true);
    setIsError(false);
  }

  return (
    <div
      {...restProps}
      {...mergeCS(styled('image'), {
        className: restProps.className,
        style: restProps.style,
      })}
    >
      {isLoading && checkNodeExist(loading) && loading}
      {isError && checkNodeExist(error) && error}
      {actions && (
        <div {...styled('image__actions')}>
          {actions.map((node, index) => {
            const { id, action } = (has(node, ['id', 'action']) ? node : { id: index, action: node }) as {
              id: React.Key;
              action: React.ReactNode;
            };
            return <Fragment key={id}>{action}</Fragment>;
          })}
        </div>
      )}
      <img
        {...imgProps}
        {...mergeCS(styled('image__img'), {
          className: imgProps?.className,
          style: {
            ...imgProps?.style,
            display: (isLoading && loading) || (isError && error) ? 'none' : undefined,
          },
        })}
        onLoadStart={(e) => {
          // https://bugs.chromium.org/p/chromium/issues/detail?id=458851
          imgProps?.onLoadStart?.(e);

          setIsLoading(true);
        }}
        onLoad={(e) => {
          imgProps?.onLoad?.(e);

          setIsLoading(false);
        }}
        onError={(e) => {
          imgProps?.onError?.(e);

          setIsLoading(false);
          setIsError(true);
        }}
      />
    </div>
  );
};

Image.Loader = ImageLoader;
Image.Action = ImageAction;
Image.Preview = ImagePreview;
