import type { CloneHTMLElement } from '../../types';

export {};

export interface PopupProps {
  children: (props: { renderTrigger: CloneHTMLElement; renderPopup: CloneHTMLElement }) => React.ReactElement | null;
  visible: boolean;
  trigger: 'hover' | 'click';
  disabled?: boolean;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  updatePosition: {
    fn: () => void;
    triggerRef: React.RefObject<HTMLElement>;
    popupRef: React.RefObject<HTMLElement>;
    scroll?: boolean;
  };
  onVisibleChange: (visible: boolean) => void;
}
