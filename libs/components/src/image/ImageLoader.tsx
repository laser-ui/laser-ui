import type { ImageLoaderProps } from './types';

import { useEffect, useState } from 'react';

const IMGS = new Map<string, any>();

export const ImageLoader: {
  (props: ImageLoaderProps): React.ReactElement | null;
  KEYS: (keyof HTMLImageElement)[];
} = (props) => {
  const { src, keys = ImageLoader.KEYS, children } = props;

  const [img, setImg] = useState(IMGS.get(src) ?? null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    const handleLoad = () => {
      const oldImg: any = IMGS.get(src) ?? {};
      const newImg: any = {};
      let update = false;
      for (const key of keys) {
        newImg[key] = img[key];
        if (!Object.is(newImg[key], oldImg[key])) {
          update = true;
        }
      }
      if (update) {
        setImg(newImg);
      }
    };
    if (img.complete) {
      handleLoad();
    } else {
      img.onload = () => {
        handleLoad();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return img ? children(img) : null;
};
ImageLoader.KEYS = ['naturalWidth', 'naturalHeight'];
