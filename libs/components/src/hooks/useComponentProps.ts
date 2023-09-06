import type { ComponentProps } from '../context/props';

import { isUndefined } from 'lodash';
import { useContext } from 'react';

import { LContext } from '../context';

export function useComponentProps<T extends object>(component: keyof ComponentProps, props: T): T {
  const context = useContext(LContext);
  const defaultProps: any = context.componentDefaultProps[component] ?? {};
  const definedProps: any = {};
  Object.keys(props).forEach((key) => {
    if (!isUndefined((props as any)[key])) {
      definedProps[key] = (props as any)[key];
    }
  });
  return Object.assign(defaultProps, definedProps);
}
