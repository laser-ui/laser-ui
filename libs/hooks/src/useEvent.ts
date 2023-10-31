import { useEffect } from 'react';

export function useEvent<E = Event>(
  target: React.RefObject<any>,
  eventName: keyof HTMLElementEventMap,
  callback?: (e: E) => void,
  options?: AddEventListenerOptions,
  disabled = false,
) {
  useEffect(() => {
    const el = target.current;
    if (el && !disabled) {
      const listener = (e: E) => {
        callback?.(e);
      };
      el.addEventListener(eventName, listener, options);

      return () => {
        el.removeEventListener(eventName, listener, options);
      };
    }
  });
}
