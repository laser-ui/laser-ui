import type { CLASSES } from './vars';
import type { BaseProps } from '../types';

export {};

export interface TimelineItem {
  content: [React.ReactNode, React.ReactNode];
  state?: 'wait' | 'active' | 'completed' | 'warning' | 'error';
  color?: string;
  dot?: React.ReactNode;
}

export interface TimelineProps<T extends TimelineItem>
  extends BaseProps<'timeline', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  list: T[];
  vertical?: boolean;
  lineSize?: number;
}
