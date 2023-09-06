import { ROOT_DATA } from '../../root/vars';

interface HorizontalSidePosition {
  top: number;
  left: number;
  transformOrigin: string;
}

export function getHorizontalSidePosition(
  targetEl: HTMLElement,
  popupSize: { width: number; height: number },
  config: {
    placement: 'right' | 'left';
    gap?: number;
    inWindow?: number | false;
  },
): HorizontalSidePosition {
  const { width, height } = popupSize;
  const { placement, gap = 10, inWindow = false } = config;

  const targetRect = targetEl.getBoundingClientRect();

  let top = targetRect.top;
  if (inWindow !== false) {
    top = Math.min(Math.max(top, inWindow), ROOT_DATA.windowSize.height - height - inWindow);
  }
  let left = placement === 'right' ? targetRect.left + targetRect.width + gap : targetRect.left - width - gap;
  if (inWindow !== false) {
    left = Math.min(Math.max(left, inWindow), ROOT_DATA.windowSize.width - width - inWindow);
  }

  const transformOrigin =
    placement === 'right'
      ? `left ${Math.min(targetRect.top - top + targetRect.height / 2, height)}px`
      : `right ${Math.min(targetRect.top - top + targetRect.height / 2, height)}px`;

  return {
    top,
    left,
    transformOrigin,
  };
}
