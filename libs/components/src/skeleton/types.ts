import type { CLASSES } from './vars';
import type { BaseProps } from '../types';

export {};

export interface SkeletonProps extends BaseProps<'skeleton', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  pattern?: 'text' | 'circular' | 'rect';
}
