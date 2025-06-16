import { useUnmount } from '@laser-ui/hooks';
import { useRef } from 'react';

let ZINDEX: number[] = [];

export function useZIndex(visible: boolean) {
  const previousVisible = useRef(false);
  const zIndex = useRef(0);

  if (visible !== previousVisible.current) {
    previousVisible.current = visible;
    if (visible) {
      zIndex.current = (ZINDEX[ZINDEX.length - 1] ?? 0) + 1;
      ZINDEX.push(zIndex.current);
    } else {
      ZINDEX = ZINDEX.filter((val) => val !== zIndex.current);
    }
  }

  useUnmount(() => {
    ZINDEX = ZINDEX.filter((z) => z !== zIndex.current);
  });

  return zIndex.current;
}
