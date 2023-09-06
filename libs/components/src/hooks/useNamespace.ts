import { useContext } from 'react';

import { LContext } from '../context';

export function useNamespace() {
  const context = useContext(LContext);

  return context.namespace;
}
