import { useEffect } from 'react';

import { ROOT_DATA } from '../root/vars';

let lockCount = 0;
let originalCssText = '';
let originalScrollTop = 0;
let originalScrollLeft = 0;

export function useLockScroll(lock: boolean) {
  useEffect(() => {
    if (lock) {
      lockCount += 1;
      if (lockCount === 1) {
        originalCssText = document.documentElement.style.cssText;
        originalScrollTop = document.documentElement.scrollTop;
        originalScrollLeft = document.documentElement.scrollLeft;

        let addCssText = 'position:fixed;width:100%;height:100%;';
        if (document.documentElement.scrollHeight > ROOT_DATA.windowSize.height) {
          addCssText += `top:-${originalScrollTop}px;overflow-y:scroll;`;
        }
        if (document.documentElement.scrollWidth > ROOT_DATA.windowSize.width) {
          addCssText += `left:-${originalScrollLeft}px;overflow-x:scroll;`;
        }
        document.documentElement.style.cssText += addCssText;
      }

      return () => {
        lockCount -= 1;
        if (lockCount === 0) {
          document.documentElement.style.cssText = originalCssText;
          document.documentElement.scrollTop = originalScrollTop;
          document.documentElement.scrollLeft = originalScrollLeft;
        }
      };
    }
  }, [lock]);
}
