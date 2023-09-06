import type { PopupPlacement } from '../../types';

import { ROOT_DATA } from '../../root/vars';

interface PopupPosition {
  top: number;
  left: number;
  transformOrigin: string;
  placement: PopupPlacement;
}

export function getPopupPosition(
  targetEl: HTMLElement,
  popupSize: { width: number; height: number },
  options: {
    placement: PopupPlacement;
    placementFallback: PopupPlacement;
    placementFixed?: boolean;
    gap?: number;
    inWindow?: number | false;
  },
): PopupPosition {
  const { width, height } = popupSize;
  const { placement, placementFallback, placementFixed = false, gap = 10, inWindow = false } = options;
  const bound = inWindow === false ? 0 : inWindow;

  const targetRect = targetEl.getBoundingClientRect();

  const updatePosition = (position: PopupPosition) => {
    if (inWindow !== false) {
      position.top = Math.min(Math.max(position.top, inWindow), ROOT_DATA.windowSize.height - height - inWindow);
      position.left = Math.min(Math.max(position.left, inWindow), ROOT_DATA.windowSize.width - width - inWindow);
    }
    return position;
  };

  const getFixedPosition = (placement: PopupPlacement) => {
    let top = 0;
    let left = 0;
    let transformOrigin = 'center bottom';

    switch (placement) {
      case 'top':
        top = targetRect.top - height - gap;
        left = targetRect.left + (targetRect.width - width) / 2;
        transformOrigin = 'center bottom';
        break;

      case 'top-left':
        top = targetRect.top - height - gap;
        left = targetRect.left;
        transformOrigin = '20px bottom';
        break;

      case 'top-right':
        top = targetRect.top - height - gap;
        left = targetRect.left + targetRect.width - width;
        transformOrigin = 'calc(100% - 20px) bottom';
        break;

      case 'right':
        top = targetRect.top + (targetRect.height - height) / 2;
        left = targetRect.left + targetRect.width + gap;
        transformOrigin = 'left center';
        break;

      case 'right-top':
        top = targetRect.top;
        left = targetRect.left + targetRect.width + gap;
        transformOrigin = 'left 12px';
        break;

      case 'right-bottom':
        top = targetRect.top + targetRect.height - height;
        left = targetRect.left + targetRect.width + gap;
        transformOrigin = 'left calc(100% - 12px)';
        break;

      case 'bottom':
        top = targetRect.top + targetRect.height + gap;
        left = targetRect.left + (targetRect.width - width) / 2;
        transformOrigin = 'center top';
        break;

      case 'bottom-left':
        top = targetRect.top + targetRect.height + gap;
        left = targetRect.left;
        transformOrigin = '20px top';
        break;

      case 'bottom-right':
        top = targetRect.top + targetRect.height + gap;
        left = targetRect.left + targetRect.width - width;
        transformOrigin = 'calc(100% - 20px) top';
        break;

      case 'left':
        top = targetRect.top + (targetRect.height - height) / 2;
        left = targetRect.left - width - gap;
        transformOrigin = 'right center';
        break;

      case 'left-top':
        top = targetRect.top;
        left = targetRect.left - width - gap;
        transformOrigin = 'right 12px';
        break;

      case 'left-bottom':
        top = targetRect.top + targetRect.height - height;
        left = targetRect.left - width - gap;
        transformOrigin = 'right calc(100% - 12px)';
        break;

      default:
        break;
    }
    return { top, left, transformOrigin };
  };

  if (placementFixed) {
    const position = getFixedPosition(placement);
    return updatePosition({ ...position, placement });
  } else {
    const getPosition = (placements: PopupPlacement[]): PopupPosition => {
      let position!: PopupPosition;
      for (const placement of placements) {
        const { top, left, transformOrigin } = getFixedPosition(placement);
        if (placement === placementFallback) {
          position = { top, left, transformOrigin, placement };
        }
        const inBound = [top, ROOT_DATA.windowSize.width - left - width, ROOT_DATA.windowSize.height - top - height, left].every(
          (num) => num >= bound,
        );
        if (inBound) {
          return { top, left, transformOrigin, placement };
        }
      }
      return position;
    };

    let position!: PopupPosition;
    if (placement.startsWith('top')) {
      position = getPosition([
        placement,
        'right',
        'right-top',
        'right-bottom',
        'left',
        'left-top',
        'left-bottom',
        ...(placement === 'top'
          ? (['bottom', 'bottom-left', 'bottom-right'] as const)
          : placement === 'top-left'
          ? (['bottom-left', 'bottom', 'bottom-right'] as const)
          : (['bottom-right', 'bottom', 'bottom-left'] as const)),
      ]);
    } else if (placement.startsWith('right')) {
      position = getPosition([
        placement,
        'top',
        'top-left',
        'top-right',
        'bottom',
        'bottom-left',
        'bottom-right',
        ...(placement === 'right'
          ? (['left', 'left-top', 'left-bottom'] as const)
          : placement === 'right-top'
          ? (['left-top', 'left', 'left-bottom'] as const)
          : (['left-bottom', 'left', 'left-top'] as const)),
      ]);
    } else if (placement.startsWith('bottom')) {
      position = getPosition([
        placement,
        'right',
        'right-top',
        'right-bottom',
        'left',
        'left-top',
        'left-bottom',
        ...(placement === 'bottom'
          ? (['top', 'top-left', 'top-right'] as const)
          : placement === 'bottom-left'
          ? (['top-left', 'top', 'top-right'] as const)
          : (['top-right', 'top', 'top-left'] as const)),
      ]);
    } else {
      position = getPosition([
        placement,
        'top',
        'top-left',
        'top-right',
        'bottom',
        'bottom-left',
        'bottom-right',
        ...(placement === 'left'
          ? (['right', 'right-top', 'right-bottom'] as const)
          : placement === 'left-top'
          ? (['right-top', 'right', 'right-bottom'] as const)
          : (['right-bottom', 'right', 'right-top'] as const)),
      ]);
    }
    return updatePosition(position);
  }
}
