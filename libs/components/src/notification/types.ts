import type { CLASSES } from './vars';
import type { BaseProps } from '../types';

export {};

export interface NotificationProps extends BaseProps<'notification', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  visible: boolean;
  title: React.ReactNode;
  type?: 'success' | 'warning' | 'error' | 'info';
  placement?: 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom';
  duration?: number;
  icon?: React.ReactNode;
  closable?: boolean;
  escClosable?: boolean;
  skipFirstTransition?: boolean;
  destroyAfterClose?: boolean;
  onClose?: () => void;
  afterVisibleChange?: (visible: boolean) => void;
}
