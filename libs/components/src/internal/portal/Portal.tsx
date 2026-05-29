import type { PortalProps } from './types';

import { useIsomorphicLayoutEffect } from '@laser-ui/hooks';
import { isString } from 'lodash';
import { useImperativeHandle, useState } from 'react';
import { createPortal } from 'react-dom';

export function Portal<T extends Element = HTMLElement>(props: PortalProps<T>): React.ReactElement | null {
  const { ref, children, selector } = props;

  const [container, setContainer] = useState<T | null>(null);

  useIsomorphicLayoutEffect(() => {
    const el = isString(selector) ? (document.querySelector(selector) as T | null) : selector();
    setContainer(el);
  }, [selector]);

  useImperativeHandle<T | null, T | null>(ref, () => container, [container]);

  return container && createPortal(children, container);
}
