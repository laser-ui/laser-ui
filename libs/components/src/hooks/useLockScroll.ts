import { useEffect } from 'react';

import { ROOT_DATA } from '../root/vars';

export function useLockScroll(lock: boolean) {
  useEffect(() => {
    if (lock) {
      const cssText = document.documentElement.style.cssText;
      const scrollTop = document.documentElement.scrollTop;
      const scrollLeft = document.documentElement.scrollLeft;

      let addCssText = 'position:fixed;width:100%;height:100%;';
      if (document.documentElement.scrollHeight > ROOT_DATA.windowSize.height) {
        addCssText += `top:-${scrollTop}px;overflow-y:scroll;`;
      }
      if (document.documentElement.scrollWidth > ROOT_DATA.windowSize.width) {
        addCssText += `left:-${scrollLeft}px;overflow-x:scroll;`;
      }
      document.documentElement.style.cssText += addCssText;

      return () => {
        document.documentElement.style.cssText = cssText;
        document.documentElement.scrollTop = scrollTop;
        document.documentElement.scrollLeft = scrollLeft;
      };
    }
  }, [lock]);
}
