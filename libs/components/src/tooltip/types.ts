import type { CLASSES } from './vars';
import type { BaseProps, PopupPlacement } from '../types';

export {};

export interface TooltipRef {
  updatePosition: () => void;
}

export interface TooltipProps
  extends BaseProps<'tooltip', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  ref?: React.Ref<TooltipRef>;
  children: (props: {
    'aria-describedby': string;
    onClick: React.MouseEventHandler<HTMLElement>;
    onMouseEnter: React.MouseEventHandler<HTMLElement>;
    onMouseLeave: React.MouseEventHandler<HTMLElement>;
    onKeyDown: React.KeyboardEventHandler<HTMLElement>;
  }) => React.ReactNode;
  title: React.ReactNode;
  visible?: boolean;
  defaultVisible?: boolean;
  trigger?: 'hover' | 'click';
  placement?: PopupPlacement;
  placementFixed?: boolean;
  arrow?: boolean;
  escClosable?: boolean;
  gap?: number;
  inWindow?: number | false;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  skipFirstTransition?: boolean;
  destroyAfterClose?: boolean;
  lazyLoading?: boolean;
  zIndex?: number | string;
  onVisibleChange?: (visible: boolean) => void;
  afterVisibleChange?: (visible: boolean) => void;
}
