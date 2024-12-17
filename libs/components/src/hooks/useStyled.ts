import { isString, isUndefined } from 'lodash';
import { use, useRef } from 'react';

import { LContext } from '../context';

export type Styled<C extends { [index: string]: string }> = (...args: (keyof C | { [K in keyof C]?: any })[]) => {
  className: string;
  style: React.CSSProperties;
};

export function useStyled<C extends { [index: string]: string }>(
  classes: C,
  styleProvider: { [index: string]: string | undefined },
  styleOverrides?: { [K in keyof C]?: { remove?: boolean; className?: string; style?: React.CSSProperties } },
): Styled<C> {
  const context = use(LContext);
  const classRoot: { [index: string]: string } = {};
  Object.keys(styleProvider).forEach((key) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    classRoot[key] = isUndefined(styleProvider[key]) ? `${context.namespace}-${key}` : styleProvider[key]!;
  });
  const prevClassRoot = useRef(classRoot);
  const cache = useRef<any>({});
  for (const key of Object.keys(classRoot)) {
    if (prevClassRoot.current[key] !== classRoot[key]) {
      prevClassRoot.current = classRoot;
      cache.current = {};
      break;
    }
  }

  const replace = (className: string) => {
    if (className in cache.current) {
      return cache.current[className];
    }
    const res = (() => {
      if (className.startsWith('^')) {
        for (const key of Object.keys(classRoot)) {
          const prefix = '^' + key;
          if (className.startsWith(prefix)) {
            if (className.length === prefix.length) {
              return classRoot[key] + className.slice(prefix.length);
            } else {
              const joiner = className.slice(prefix.length, prefix.length + 2);
              if (['--', '__'].includes(joiner)) {
                return classRoot[key] + className.slice(prefix.length);
              }
            }
          }
        }
      }
      return className;
    })();
    cache.current[className] = res;
    return res;
  };

  return (...args) => {
    const className: string[] = [];
    const style: React.CSSProperties = {};
    const handleKey = (classKey: string) => {
      let remove = false;
      if (styleOverrides && styleOverrides[classKey]) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const styleOverride = styleOverrides[classKey]!;
        if (styleOverride.remove) {
          remove = true;
        }
        if (styleOverride.className) {
          className.push(styleOverride.className);
        }
        if (styleOverride.style) {
          Object.assign(style, styleOverride.style);
        }
      }
      if (!remove) {
        className.push(replace(classes[classKey]));
      }
    };
    args.forEach((classKey) => {
      if (isString(classKey)) {
        handleKey(classKey);
      } else {
        Object.keys(classKey).forEach((key) => {
          if ((classKey as any)[key]) {
            handleKey(key);
          }
        });
      }
    });

    return { className: className.join(' '), style };
  };
}
