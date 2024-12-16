import type { AffixProps } from './types';

import { useEventCallback, useIsomorphicLayoutEffect, useRefExtra, useResize } from '@laser-ui/hooks';
import { getOffsetToRoot, toPx } from '@laser-ui/utils';
import { isString, isUndefined } from 'lodash';
import { useId, useImperativeHandle, useState } from 'react';

import { useComponentProps, useContainerScrolling, useLayout, useNamespace } from '../hooks';

export function Affix(props: AffixProps): React.ReactElement | null {
  const { ref, children, top = 0, target, zIndex } = useComponentProps('Affix', props);

  const namespace = useNamespace();

  const { pageScrollRef, contentResizeRef } = useLayout();

  const uniqueId = useId();

  const affixRef = useRefExtra(() => document.querySelector(`[data-l-affix="${uniqueId}"]`) as HTMLElement);
  const placeholderRef = useRefExtra(() => document.querySelector(`[data-l-affix-placeholder="${uniqueId}"]`) as HTMLElement);
  const targetRef = useRefExtra(isUndefined(target) ? () => pageScrollRef.current : target);

  const [sticky, setSticky] = useState(false);

  const updatePosition = useEventCallback(() => {
    if (affixRef.current && placeholderRef.current && targetRef.current) {
      const offsetEl = sticky ? placeholderRef.current : affixRef.current;

      const offsetRect = offsetEl.getBoundingClientRect();
      const targetTop = getOffsetToRoot(targetRef.current);
      const distance = isString(top) ? toPx(top, true) : top;

      const s = Math.ceil(targetRef.current.scrollTop) + distance >= getOffsetToRoot(offsetEl as HTMLElement) - targetTop;
      setSticky(s);
      if (s) {
        affixRef.current.style.position = 'fixed';
        affixRef.current.style.top = (isUndefined(target) ? targetTop : targetRef.current.getBoundingClientRect().top) + distance + 'px';
        affixRef.current.style.left = offsetRect.left + 'px';
        affixRef.current.style.width = offsetRect.width + 'px';
        affixRef.current.style.height = offsetRect.height + 'px';
        affixRef.current.style.zIndex = zIndex ? String(zIndex) : `var(--${namespace}-zindex-sticky)`;
        placeholderRef.current.style.display = '';
      } else {
        affixRef.current.style.position = '';
        affixRef.current.style.top = '';
        affixRef.current.style.left = '';
        affixRef.current.style.width = '';
        affixRef.current.style.height = '';
        affixRef.current.style.zIndex = '';
        placeholderRef.current.style.display = 'none';
      }
    }
  });
  useIsomorphicLayoutEffect(() => {
    updatePosition();
  }, []);

  useContainerScrolling(affixRef, updatePosition);

  useResize(sticky ? placeholderRef : affixRef, updatePosition);
  useResize(contentResizeRef, updatePosition);

  useImperativeHandle(
    ref,
    () => ({
      sticky,
      updatePosition,
    }),
    [sticky, updatePosition],
  );

  return (
    <>
      {children({
        style: { visibility: 'hidden' },
        'aria-hidden': true,
        'data-l-affix-placeholder': uniqueId,
      })}
      {children({ 'data-l-affix': uniqueId })}
    </>
  );
}
