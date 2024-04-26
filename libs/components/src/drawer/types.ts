import type { CLASSES } from './vars';
import type { ButtonProps } from '../button';
import type { BaseProps } from '../types';
import type { RefExtra } from '@laser-ui/hooks/useRefExtra';

export {};

export interface DrawerProps extends BaseProps<'drawer', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  visible: boolean;
  header?: React.ReactElement | string;
  footer?: React.ReactElement;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  width?: number | string;
  height?: number | string;
  mask?: boolean;
  maskClosable?: boolean;
  escClosable?: boolean;
  container?: RefExtra;
  skipFirstTransition?: boolean;
  destroyAfterClose?: boolean;
  zIndex?: number | string;
  onClose?: () => void;
  afterVisibleChange?: (visible: boolean) => void;
}

export interface DrawerHeaderProps extends BaseProps<'drawer', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  actions?: React.ReactNode[];
  closeProps?: ButtonProps;
  onCloseClick?: () => any | Promise<any>;
}

export interface DrawerFooterProps extends BaseProps<'drawer', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  align?: 'left' | 'center' | 'right';
  actions?: React.ReactNode[];
  cancelProps?: ButtonProps;
  okProps?: ButtonProps;
  onCancelClick?: () => any | Promise<any>;
  onOkClick?: () => any | Promise<any>;
}

export interface Offsets {
  top: number[];
  right: number[];
  bottom: number[];
  left: number[];
}
