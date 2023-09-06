import type { PortalProps } from './types';

import { useIsomorphicLayoutEffect } from '@laser-ui/hooks';
import { isString } from 'lodash';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { createPortal } from 'react-dom';

export const Portal = forwardRef<HTMLElement, PortalProps>((props, ref): JSX.Element | null => {
  const { children, selector } = props;

  const [container, setContainer] = useState<any>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useIsomorphicLayoutEffect(() => {
    setContainer(isString(selector) ? document.querySelector(selector) : selector());
  });

  useImperativeHandle(ref, () => container, [container]);

  return container && createPortal(children, container);
});
