import type { CLASSES } from './vars';
import type { BaseProps, Size } from '../types';

export {};

export interface TagProps extends BaseProps<'tag', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  pattern?: 'primary' | 'fill' | 'outline';
  theme?: 'primary' | 'success' | 'warning' | 'danger';
  size?: Size;
}
