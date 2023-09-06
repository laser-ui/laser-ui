import type { CloneHTMLElement } from '../types';

import { useAsync, useEvent, useRefExtra } from '@laser-ui/hooks';
import { cloneElement, useRef, useState } from 'react';

export function useFocusVisible(isValidCode: (code: string) => boolean): [boolean, CloneHTMLElement] {
  const windowRef = useRefExtra(() => window);

  const async = useAsync();

  const hadKeyboardEvent = useRef(false);

  const [focusVisible, setFocusVisible] = useState(false);

  useEvent(windowRef, 'keydown', () => {
    hadKeyboardEvent.current = true;
    async.requestAnimationFrame(() => {
      hadKeyboardEvent.current = false;
    });
  });

  return [
    focusVisible,
    (el) =>
      cloneElement<React.HTMLAttributes<HTMLElement>>(el, {
        onFocus: (e) => {
          el.props.onFocus?.(e);

          if (hadKeyboardEvent.current) {
            setFocusVisible(true);
          }
        },
        onBlur: (e) => {
          el.props.onBlur?.(e);

          setFocusVisible(false);
        },
        onKeyDown: (e) => {
          el.props.onKeyDown?.(e);

          if (isValidCode(e.code)) {
            setFocusVisible(true);
          }
        },
      }),
  ];
}
