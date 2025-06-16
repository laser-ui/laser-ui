import { useUnmount } from '@laser-ui/hooks';
import { isUndefined } from 'lodash';
import { useId, useRef } from 'react';

const ZINDEX: number[] = [0];
const INDEX = new Map<string, number>();

export function useZIndex(visible: boolean) {
  const id = useId();
  const zIndex = useRef(0);

  if (visible) {
    const index = INDEX.get(id);
    if (isUndefined(index)) {
      zIndex.current = ZINDEX[ZINDEX.length - 1] + 1;
      ZINDEX.push(zIndex.current);
      INDEX.set(id, ZINDEX.length - 1);
    }
  } else {
    const index = INDEX.get(id);
    if (!isUndefined(index)) {
      ZINDEX.splice(index, 1);
      INDEX.delete(id);
    }
  }

  useUnmount(() => {
    const index = INDEX.get(id);
    if (!isUndefined(index)) {
      ZINDEX.splice(index, 1);
      INDEX.delete(id);
    }
  });

  return zIndex.current;
}
