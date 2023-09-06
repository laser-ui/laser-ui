import { useRefExtra } from '@laser-ui/hooks';
import { useContext } from 'react';

import { LContext } from '../context';

export function useLayout() {
  const context = useContext(LContext);

  const pageScrollRef = useRefExtra(context.layoutPageScrollEl ?? (() => null));
  const contentResizeRef = useRefExtra(context.layoutContentResizeEl ?? (() => null));

  return { pageScrollRef, contentResizeRef };
}
