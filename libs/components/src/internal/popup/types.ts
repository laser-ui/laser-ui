export {};

export interface PopupProps {
  children: (props: {
    trigger: {
      onClick: React.MouseEventHandler<HTMLElement>;
      onMouseEnter: React.MouseEventHandler<HTMLElement>;
      onMouseLeave: React.MouseEventHandler<HTMLElement>;
    };
    popup: {
      onClick: React.MouseEventHandler<HTMLElement>;
      onMouseEnter: React.MouseEventHandler<HTMLElement>;
      onMouseLeave: React.MouseEventHandler<HTMLElement>;
    };
  }) => React.ReactElement | null;
  visible: boolean;
  trigger: 'hover' | 'click';
  disabled?: boolean;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  updatePosition: {
    fn: () => void;
    triggerRef: React.RefObject<HTMLElement | null>;
    popupRef: React.RefObject<HTMLElement | null>;
    scroll?: boolean;
  };
  onVisibleChange: (visible: boolean) => void;
}
