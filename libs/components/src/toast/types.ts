import type { CLASSES } from './vars';
import type { BaseProps } from '../types';

export {};

export interface ToastProps extends BaseProps<'toast', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  visible: boolean;
  type?: 'success' | 'warning' | 'error' | 'info';
  placement?: 'top' | 'bottom';
  duration?: number;
  icon?: React.ReactNode;
  closable?: boolean;
  escClosable?: boolean;
  skipFirstTransition?: boolean;
  destroyAfterClose?: boolean;
  onClose?: () => void;
  afterVisibleChange?: (visible: boolean) => void;
}
