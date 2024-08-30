import type { CloneHTMLElement } from '../../types';

export {};

export interface PopupProps {
  children: (props: { renderTrigger: CloneHTMLElement; renderPopup: CloneHTMLElement }) => JSX.Element | null;
  visible: boolean;
  trigger: 'hover' | 'click';
  disabled?: boolean;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  updatePosition: {
    fn: () => void;
    triggerRef: React.RefObject<HTMLElement>;
    popupRef: React.RefObject<HTMLElement>;
  };
  onVisibleChange: (visible: boolean) => void;
}
