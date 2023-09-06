import type { CLASSES } from './vars';
import type { BaseProps, CloneHTMLElement, PopupPlacement } from '../types';
import type { RefExtra } from '@laser-ui/hooks/useRefExtra';

export {};

export interface TooltipRef {
  updatePosition: () => void;
}

export interface TooltipProps
  extends BaseProps<'tooltip', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  children: React.ReactElement | ((render: CloneHTMLElement) => JSX.Element | null);
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
  zIndex?: number | string;
  scrolling?: RefExtra;
  onVisibleChange?: (visible: boolean) => void;
  afterVisibleChange?: (visible: boolean) => void;
}
