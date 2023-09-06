import type { CLASSES } from './vars';
import type { BaseProps } from '../types';

export {};

export interface AlertProps extends BaseProps<'alert', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  visible?: boolean;
  type?: 'success' | 'warning' | 'error' | 'info';
  title?: React.ReactNode;
  icon?: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
  afterVisibleChange?: (visible: boolean) => void;
}
