import type { CLASSES } from './vars';
import type { BaseProps } from '../types';

export {};

export interface SpinnerProps extends BaseProps<'spinner', typeof CLASSES>, React.HTMLAttributes<HTMLElement> {
  visible: boolean;
  text?: React.ReactNode;
  size?: number | string;
  delay?: number;
  alone?: boolean;
  afterVisibleChange?: (visible: boolean) => void;
}
