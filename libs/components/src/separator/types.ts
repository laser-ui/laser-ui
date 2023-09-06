import type { CLASSES } from './vars';
import type { BaseProps } from '../types';

export {};

export interface SeparatorProps extends BaseProps<'separator', typeof CLASSES>, React.HTMLAttributes<HTMLElement> {
  textAlign?: 'left' | 'right' | 'center';
  vertical?: boolean;
}
