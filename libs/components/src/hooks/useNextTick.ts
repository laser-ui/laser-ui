import { useMount } from '@laser-ui/hooks';
import { useRef } from 'react';

export function useNextTick() {
  const nextTick = useRef(false);

  useMount(() => {
    nextTick.current = true;
  });

  return nextTick;
}
