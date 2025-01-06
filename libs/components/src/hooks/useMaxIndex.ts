import { useUnmount } from '@laser-ui/hooks';
import { nth } from 'lodash';
import { useMemo, useRef } from 'react';

let ZINDEX: number[] = [];

export function useMaxIndex(visible: boolean) {
  const zIndex = useRef(0);

  const maxZIndex = useMemo(() => {
    if (visible) {
      const z = (nth(ZINDEX, -1) ?? 0) + 1;
      zIndex.current = z;
      ZINDEX.push(z);
      return z;
    } else {
      ZINDEX = ZINDEX.filter((z) => z !== zIndex.current);
      return zIndex.current;
    }
  }, [visible]);

  useUnmount(() => {
    ZINDEX = ZINDEX.filter((z) => z !== zIndex.current);
  });

  return maxZIndex;
}
