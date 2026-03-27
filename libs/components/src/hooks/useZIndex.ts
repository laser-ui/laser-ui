import { useIsomorphicLayoutEffect } from '@laser-ui/hooks';
import { useId, useState } from 'react';

const ZINDEX = new Map<string, number>([['$ZERO', 0]]);

export function useZIndex(visible: boolean) {
  const id = useId();
  const [zIndex, setZIndex] = useState(0);

  useIsomorphicLayoutEffect(() => {
    if (visible) {
      let zIndex = 1;
      const end = Array.from(ZINDEX).at(-1);
      if (end) {
        zIndex = end[1] + 1;
      }
      ZINDEX.set(id, zIndex);
      setZIndex(zIndex);
      return () => {
        ZINDEX.delete(id);
      };
    } else {
      ZINDEX.delete(id);
    }
  }, [id, visible]);

  return zIndex;
}
