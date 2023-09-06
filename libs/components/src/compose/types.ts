import type { CLASSES } from './vars';
import type { BaseProps, Size } from '../types';

export {};

export interface ComposeProps extends BaseProps<'compose', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  size?: Size;
  vertical?: boolean;
  disabled?: boolean;
}

export interface ComposeItemProps extends BaseProps<'compose', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  gray?: boolean;
}
