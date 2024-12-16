import type { CLASSES } from './vars';
import type { ButtonProps } from '../button';
import type { BaseProps, PopupPlacement } from '../types';

export {};

export interface PopoverRef {
  updatePosition: () => void;
}

export interface PopoverProps
  extends BaseProps<'popover', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'content'> {
  ref?: React.Ref<PopoverRef>;
  children: (props: {
    id: string;
    onClick: React.MouseEventHandler<HTMLElement>;
    onMouseEnter: React.MouseEventHandler<HTMLElement>;
    onMouseLeave: React.MouseEventHandler<HTMLElement>;
    onKeyDown: React.KeyboardEventHandler<HTMLElement>;
  }) => React.ReactNode;
  content: React.ReactNode;
  header?: React.ReactElement | string;
  footer?: React.ReactElement;
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
  modal?: boolean;
  skipFirstTransition?: boolean;
  destroyAfterClose?: boolean;
  lazyLoading?: boolean;
  zIndex?: number | string;
  onVisibleChange?: (visible: boolean) => void;
  afterVisibleChange?: (visible: boolean) => void;
}

export interface PopoverHeaderProps extends BaseProps<'popover', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  actions?: (React.ReactNode | { id: React.Key; action: React.ReactNode })[];
  closeProps?: ButtonProps;
  onCloseClick?: () => any | Promise<any>;
}

export interface PopoverFooterProps extends BaseProps<'popover', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  align?: 'left' | 'center' | 'right';
  actions?: (React.ReactNode | { id: React.Key; action: React.ReactNode })[];
  cancelProps?: ButtonProps;
  okProps?: ButtonProps;
  onCancelClick?: () => any | Promise<any>;
  onOkClick?: () => any | Promise<any>;
}
