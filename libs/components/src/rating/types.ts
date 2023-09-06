import type { CLASSES } from './vars';
import type { FormControlProvider } from '../form/types';
import type { BaseProps } from '../types';

export {};

export interface RatingProps extends BaseProps<'rating', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  formControl?: FormControlProvider;
  model?: number;
  defaultModel?: number;
  total?: number;
  icon?: React.ReactNode | ((value: number) => React.ReactNode);
  tooltip?: (value: number) => React.ReactNode;
  name?: string;
  half?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  onModelChange?: (value: number) => void;
}
