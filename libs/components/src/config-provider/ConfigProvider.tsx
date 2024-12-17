import type { ConfigProviderProps } from './types';

import { use, useMemo } from 'react';

import { LContextManager } from '../context';
import { LContext } from '../context';

export function ConfigProvider(props: ConfigProviderProps): React.ReactElement | null {
  const { children, context: contextProp } = props;

  const parent = use(LContext);

  const context = useMemo<LContextManager>(() => {
    const context = new LContextManager(parent.derive(contextProp ?? {}));
    context.setParent(parent);
    return context;
  }, [contextProp, parent]);

  return <LContext value={context}>{children}</LContext>;
}
