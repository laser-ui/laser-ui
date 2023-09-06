import type { CLASSES } from './vars';
import type { ButtonProps } from '../button';
import type { BaseProps } from '../types';

export {};

export interface ModalProps extends BaseProps<'modal', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  visible: boolean;
  header?: React.ReactElement | string;
  footer?: React.ReactElement;
  alert?: React.ReactElement;
  width?: number | string;
  top?: number | string;
  mask?: boolean;
  maskClosable?: boolean;
  escClosable?: boolean;
  skipFirstTransition?: boolean;
  destroyAfterClose?: boolean;
  zIndex?: number | string;
  onClose?: () => void;
  afterVisibleChange?: (visible: boolean) => void;
}

export interface ModalHeaderProps extends BaseProps<'modal', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  actions?: React.ReactNode[];
  closeProps?: ButtonProps;
  onCloseClick?: () => any | Promise<any>;
}

export interface ModalFooterProps extends BaseProps<'modal', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  align?: 'left' | 'center' | 'right';
  actions?: React.ReactNode[];
  cancelProps?: ButtonProps;
  okProps?: ButtonProps;
  onCancelClick?: () => any | Promise<any>;
  onOkClick?: () => any | Promise<any>;
}

export interface ModalAlertProps extends BaseProps<'modal', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  type: 'success' | 'warning' | 'error' | 'info';
  title?: React.ReactNode;
  icon?: React.ReactNode;
}
