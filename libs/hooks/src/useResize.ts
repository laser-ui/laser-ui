import { isUndefined } from 'lodash';
import { useEffect, useRef } from 'react';

let checkResize = (cb1: () => void, cb2: () => void, entry: any) => {
  if ('borderBoxSize' in entry) {
    checkResize = (cb1: () => void) => {
      cb1();
    };
  } else {
    checkResize = (cb1: () => void, cb2: () => void) => {
      cb2();
    };
  }
};

export function useResize(
  target: React.RefObject<Element | null>,
  cb?: ResizeObserverCallback,
  options?: { skipEmpty?: boolean },
  disabled = false,
): void {
  const { skipEmpty = true } = options ?? {};

  const prevContentRect = useRef<{ width: number; height: number }>(undefined);

  if (disabled) {
    prevContentRect.current = undefined;
  }

  useEffect(() => {
    if (target.current && !disabled) {
      const observer = new ResizeObserver((entries, observer) => {
        const entry = entries[0];
        checkResize(
          () => {
            if (
              !isUndefined(prevContentRect.current) &&
              !(skipEmpty && entry.borderBoxSize[0].blockSize === 0 && entry.borderBoxSize[0].inlineSize === 0) &&
              (prevContentRect.current.width !== entry.borderBoxSize[0].inlineSize ||
                prevContentRect.current.height !== entry.borderBoxSize[0].blockSize)
            ) {
              cb?.(entries, observer);
            }
            prevContentRect.current = { width: entry.borderBoxSize[0].inlineSize, height: entry.borderBoxSize[0].blockSize };
          },
          () => {
            if (
              !isUndefined(prevContentRect.current) &&
              !(skipEmpty && entry.contentRect.width === 0 && entry.contentRect.height === 0) &&
              (prevContentRect.current.width !== entry.contentRect.width || prevContentRect.current.height !== entry.contentRect.height)
            ) {
              cb?.(entries, observer);
            }
            prevContentRect.current = { width: entry.contentRect.width, height: entry.contentRect.height };
          },
          entry,
        );
      });
      observer.observe(target.current);
      return () => {
        observer.disconnect();
      };
    }
  });
}
