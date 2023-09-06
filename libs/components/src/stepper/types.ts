import type { CLASSES } from './vars';
import type { BaseProps } from '../types';

export {};

export interface StepperItem {
  step?: number;
  title: React.ReactNode;
  description?: React.ReactNode;
  state?: 'wait' | 'active' | 'completed' | 'warning' | 'error';
  color?: string;
  dot?: React.ReactNode;
}

export interface StepperProps<T extends StepperItem>
  extends BaseProps<'stepper', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onClick'> {
  list: T[];
  active: number;
  percent?: number;
  dotSize?: number;
  clickable?: boolean;
  labelBottom?: boolean;
  vertical?: boolean;
  onClick?: (step: number, origin: T) => void;
}
