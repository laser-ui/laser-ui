import type { CLASSES } from './vars';
import type { FormControlProvider } from '../form/types';
import type { BaseProps, Size } from '../types';

export {};

export interface TextareaProps extends BaseProps<'textarea', typeof CLASSES>, React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  formControl?: FormControlProvider;
  model?: string;
  defaultModel?: string;
  autoRows?: boolean | { minRows?: number; maxRows?: number };
  resizable?: boolean;
  showCount?: boolean | ((count: number) => React.ReactNode);
  size?: Size;
  onModelChange?: (value: string) => void;
}
