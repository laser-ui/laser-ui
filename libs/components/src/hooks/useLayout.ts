import { useRefExtra } from '@laser-ui/hooks';
import { use } from 'react';

import { LContext } from '../context';

export function useLayout() {
  const context = use(LContext);

  const pageScrollRef = useRefExtra(context.layoutPageScrollEl ?? (() => null));
  const contentResizeRef = useRefExtra(context.layoutContentResizeEl ?? (() => null));

  return { pageScrollRef, contentResizeRef };
}
