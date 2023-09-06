import { useUnmount } from '@laser-ui/hooks';
import { useId, useMemo, useRef } from 'react';

const MAX_INDEX_MANAGER = {
  record: [] as { id: string; n: number }[],

  add(id: string): number {
    let n = 1;
    if (this.record.length > 0) {
      n = this.record[this.record.length - 1].n + 1;
    }
    this.record.push({ id, n });
    return n;
  },

  delete(id: string) {
    this.record = this.record.filter((item) => item.id !== id);
  },
};

export function useMaxIndex(visible: boolean) {
  const id = useId();

  const prevMaxZIndex = useRef(0);

  const maxZIndex = useMemo(() => {
    if (visible) {
      return MAX_INDEX_MANAGER.add(id);
    }

    MAX_INDEX_MANAGER.delete(id);
    return prevMaxZIndex.current;
  }, [id, visible]);
  prevMaxZIndex.current = maxZIndex;

  useUnmount(() => {
    MAX_INDEX_MANAGER.delete(id);
  });

  return maxZIndex;
}
