import { useReducer } from 'react';

export function useForceUpdate() {
  const [, forceUpdate] = useReducer((n) => n + 1, 0);
  return forceUpdate;
}
