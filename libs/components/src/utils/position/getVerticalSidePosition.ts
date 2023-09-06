import type { VerticalSidePlacement } from '../../types';

import { ROOT_DATA } from '../../root/vars';

interface VerticalSidePosition {
  top: number;
  left: number;
  transformOrigin: string;
  placement: VerticalSidePlacement;
}

export function getVerticalSidePosition(
  targetEl: HTMLElement,
  popupSize: { width: number; height: number },
  config: {
    placement: VerticalSidePlacement;
    placementFixed?: boolean;
    gap?: number;
    inWindow?: number | false;
  },
): VerticalSidePosition {
  const { width, height } = popupSize;
  const { placement, placementFixed = false, gap = 8, inWindow = false } = config;
  const bound = inWindow === false ? 0 : inWindow;

  const targetRect = targetEl.getBoundingClientRect();

  const getPosition = (placement: VerticalSidePlacement, defaultPosition?: VerticalSidePosition): VerticalSidePosition => {
    let top =
      placement === 'top' || placement === 'top-left' || placement === 'top-right'
        ? targetRect.top - height - gap
        : targetRect.top + targetRect.height + gap;
    let left =
      placement === 'top' || placement === 'bottom'
        ? targetRect.left + (targetRect.width - width) / 2
        : placement === 'top-left' || placement === 'bottom-left'
        ? targetRect.left
        : targetRect.left + targetRect.width - width;
    const inBound = [top, ROOT_DATA.windowSize.width - left - width, ROOT_DATA.windowSize.height - top - height, left].every(
      (num) => num >= bound,
    );
    if (inWindow !== false) {
      top = Math.min(Math.max(top, inWindow), ROOT_DATA.windowSize.height - height - inWindow);
    }
    if (inWindow !== false) {
      left = Math.min(Math.max(left, inWindow), window.screen.availWidth - width - inWindow);
    }

    const transformOrigin = placement === 'top' || placement === 'top-left' || placement === 'top-right' ? 'center bottom' : 'center top';

    const position = {
      top,
      left,
      transformOrigin,
      placement,
    };

    if (!placementFixed && !inBound) {
      if (defaultPosition) {
        return defaultPosition;
      } else {
        return getPosition(
          placement.includes('top')
            ? (placement.replace('top', 'bottom') as VerticalSidePlacement)
            : (placement.replace('bottom', 'top') as VerticalSidePlacement),
          position,
        );
      }
    }

    return position;
  };

  return getPosition(placement);
}
