import type { CLASSES } from './vars';
import type { BaseProps } from '../types';

export {};

export interface ProgressProps extends BaseProps<'progress', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  percent: number;
  pattern?: 'line' | 'circle' | 'dashboard';
  state?: 'success' | 'warning' | 'error' | 'process';
  label?: React.ReactNode;
  size?: number;
  wave?: boolean;
  lineCap?: 'butt' | 'round';
  lineWidth?: number;
  gapDegree?: number;
  linearGradient?: { 0: string; 100: string };
}
