import type { AffixProps, AffixRef } from './types';

import { useEventCallback, useMount, useRefExtra, useResize } from '@laser-ui/hooks';
import { getOffsetToRoot, toPx } from '@laser-ui/utils';
import { isFunction, isString, isUndefined } from 'lodash';
import { cloneElement, forwardRef, useId, useImperativeHandle, useState } from 'react';

import { useComponentProps, useContainerScrolling, useJSS, useLayout, useNamespace } from '../hooks';

export const Affix = forwardRef<AffixRef, AffixProps>((props, ref): JSX.Element | null => {
  const { children, top = 0, target, zIndex } = useComponentProps('Affix', props);

  const namespace = useNamespace();
  const sheet = useJSS<'position'>();

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

      const newSticky = Math.ceil(targetRef.current.scrollTop) + distance >= getOffsetToRoot(offsetEl as HTMLElement) - targetTop;
      setSticky(newSticky);
      if (sheet.classes.position) {
        affixRef.current.classList.toggle(sheet.classes.position, false);
      }
      if (newSticky) {
        sheet.replaceRule('position', {
          width: offsetRect.width,
          height: offsetRect.height,
          position: 'fixed',
          top: (isUndefined(target) ? targetTop : targetRef.current.getBoundingClientRect().top) + distance,
          left: offsetRect.left,
          zIndex: zIndex ?? `var(--${namespace}-zindex-sticky)`,
        });
        affixRef.current.classList.toggle(sheet.classes.position, true);
        placeholderRef.current.style.display = '';
      } else {
        sheet.deleteRule('position');
        placeholderRef.current.style.display = 'none';
      }
    }
  });
  useMount(() => {
    updatePosition();
  });

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

  const render = (el: React.ReactElement) => (
    <>
      {cloneElement(el, {
        style: {
          ...el.props.style,
          visibility: 'hidden',
        },
        'aria-hidden': true,
        'data-l-affix-placeholder': uniqueId,
      })}
      {cloneElement(el, {
        'data-l-affix': uniqueId,
      })}
    </>
  );

  return isFunction(children) ? children(render) : render(children);
});
