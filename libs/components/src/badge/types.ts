import type { CLASSES } from './vars';
import type { BaseProps } from '../types';

export {};

export interface BadgeProps extends BaseProps<'badge', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  value: number;
  theme?: 'primary' | 'success' | 'warning' | 'danger';
  max?: number;
  dot?: boolean;
  showZero?: boolean;
  offset?: [number | string, number | string];
  alone?: boolean;
}

export interface BadgeTextProps extends BaseProps<'badge', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  text: string;
  theme?: 'primary' | 'success' | 'warning' | 'danger';
  offset?: [number | string, number | string];
  alone?: boolean;
}
