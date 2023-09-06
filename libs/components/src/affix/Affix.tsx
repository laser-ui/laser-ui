import type { AffixProps, AffixRef } from './types';

import { useEvent, useEventCallback, useIsomorphicLayoutEffect, useRefExtra, useResize } from '@laser-ui/hooks';
import { getOffsetToRoot, toPx } from '@laser-ui/utils';
import { isFunction, isString, isUndefined } from 'lodash';
import { cloneElement, forwardRef, useId, useImperativeHandle, useState } from 'react';

import { useComponentProps, useLayout, useListenGlobalScrolling, useNamespace } from '../hooks';

export const Affix = forwardRef<AffixRef, AffixProps>((props, ref): JSX.Element | null => {
  const { children, top = 0, target, zIndex } = useComponentProps('Affix', props);

  const namespace = useNamespace();

  const { pageScrollRef, contentResizeRef } = useLayout();

  const uniqueId = useId();

  const affixRef = useRefExtra(() => document.querySelector(`[data-l-affix="${uniqueId}"]`));
  const referenceRef = useRefExtra(() => document.querySelector(`[data-l-affix-reference="${uniqueId}"]`));
  const targetRef = useRefExtra(isUndefined(target) ? () => pageScrollRef.current : target);

  const [sticky, setSticky] = useState(false);

  const [positionStyle, setPositionStyle] = useState<React.CSSProperties>();
  const updatePosition = useEventCallback(() => {
    const offsetEl = sticky ? referenceRef.current : affixRef.current;

    if (targetRef.current && offsetEl) {
      const offsetRect = offsetEl.getBoundingClientRect();
      const targetTop = getOffsetToRoot(targetRef.current);
      const distance = isString(top) ? toPx(top, true) : top;

      setSticky(Math.ceil(targetRef.current.scrollTop) + distance >= getOffsetToRoot(offsetEl as HTMLElement) - targetTop);
      setPositionStyle({
        width: offsetRect.width,
        height: offsetRect.height,
        top: (isUndefined(target) ? targetTop : targetRef.current.getBoundingClientRect().top) + distance,
        left: offsetRect.left,
      });
    }
  });
  useIsomorphicLayoutEffect(() => {
    updatePosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const listenGlobalScrolling = useListenGlobalScrolling(updatePosition);
  useEvent(pageScrollRef, 'scroll', updatePosition, { passive: true }, listenGlobalScrolling);
  useEvent(targetRef, 'scroll', updatePosition, { passive: true }, listenGlobalScrolling || isUndefined(target));

  useResize(sticky ? referenceRef : affixRef, updatePosition);
  useResize(contentResizeRef, updatePosition);

  useImperativeHandle(
    ref,
    () => ({
      sticky,
      updatePosition,
    }),
    [sticky, updatePosition],
  );

  const render = (el: React.ReactElement) => (
    <>
      {sticky &&
        cloneElement(el, {
          style: {
            ...el.props.style,
            visibility: 'hidden',
          },
          'aria-hidden': true,
          'data-l-affix-reference': uniqueId,
        })}
      {cloneElement(el, {
        style: sticky
          ? {
              ...el.props.style,
              ...positionStyle,
              position: 'fixed',
              zIndex: zIndex ?? `var(--${namespace}-zindex-sticky)`,
            }
          : el.props.style,
        'data-l-affix': uniqueId,
      })}
    </>
  );

  return isFunction(children) ? children(render) : render(children);
});
