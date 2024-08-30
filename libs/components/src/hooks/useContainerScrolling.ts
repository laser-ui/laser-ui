import { useScroll } from '@laser-ui/hooks';
import { useEffect, useRef } from 'react';

export function useContainerScrolling(target: React.RefObject<HTMLElement | null>, callback?: () => void, disabled = false) {
  const parentElements = useRef(new WeakSet<HTMLElement>());
  useEffect(() => {
    let el: HTMLElement | null = target.current;
    while (el) {
      parentElements.current.add(el);
      el = el.parentElement;
    }
  }, []);

  useScroll(
    false,
    (e) => {
      if (parentElements.current.has(e.target as any)) {
        callback?.();
      }
    },
    disabled,
  );
}
