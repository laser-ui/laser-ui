import { useEffect } from 'react';

const listeners = new Set<(e: Event) => void>();

let initScrollListener = () => {
  if (typeof window === 'undefined') return;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  initScrollListener = () => {};
  window.addEventListener(
    'scroll',
    (e) => {
      for (const cb of listeners) {
        cb(e);
      }
    },
    { passive: true, capture: true },
  );
};

export function useScroll(target: React.RefObject<Element | null> | false, cb?: (e: Event) => void, disabled = false): void {
  useEffect(() => {
    initScrollListener();
    if ((target === false || target.current) && !disabled) {
      const handleScroll = (e: Event) => {
        if (target === false || target.current === e.target) {
          cb?.(e);
        }
      };
      listeners.add(handleScroll);
      return () => {
        listeners.delete(handleScroll);
      };
    }
  });
}
