import { useAsync, useEvent, useRefExtra } from '@laser-ui/hooks';
import { useRef, useState } from 'react';

export function useFocusVisible(isValidCode: (code: string) => boolean): [
  boolean,
  {
    onFocus: React.FocusEventHandler<HTMLElement>;
    onBlur: React.FocusEventHandler<HTMLElement>;
    onKeyDown: React.KeyboardEventHandler<HTMLElement>;
  },
] {
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
    {
      onFocus: () => {
        if (hadKeyboardEvent.current) {
          setFocusVisible(true);
        }
      },
      onBlur: () => {
        setFocusVisible(false);
      },
      onKeyDown: (e) => {
        if (isValidCode(e.code)) {
          setFocusVisible(true);
        }
      },
    },
  ];
}
