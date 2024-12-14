import type { LazyLoadingProps } from './types';

import { useRef } from 'react';

export function LazyLoading(props: LazyLoadingProps): React.ReactNode {
  const { children, hidden, disabled = false } = props;

  const loaded = useRef(disabled ? true : !hidden);

  if (!hidden) {
    loaded.current = true;
  }

  return loaded.current ? children : null;
}
