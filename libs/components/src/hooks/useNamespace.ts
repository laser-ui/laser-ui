import { use } from 'react';

import { LContext } from '../context';

export function useNamespace() {
  const context = use(LContext);

  return context.namespace;
}
