import type { CLASSES } from './vars';
import type { BaseProps, Size } from '../types';

export {};

export interface ButtonProps extends BaseProps<'button', typeof CLASSES>, React.ButtonHTMLAttributes<HTMLButtonElement> {
  pattern?: 'primary' | 'secondary' | 'outline' | 'dashed' | 'text' | 'link';
  theme?: 'primary' | 'success' | 'warning' | 'danger';
  loading?: boolean;
  shape?: 'circle' | 'round';
  block?: boolean;
  size?: Size;
  icon?: React.ReactNode;
  iconRight?: boolean;
}
