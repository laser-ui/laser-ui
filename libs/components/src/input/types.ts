import type { CLASSES } from './vars';
import type { FormControlProvider } from '../form/types';
import type { BaseProps, Size } from '../types';

export {};

export interface InputProps extends BaseProps<'input', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'prefix'> {
  formControl?: FormControlProvider;
  model?: string;
  defaultModel?: string;
  type?: React.HTMLInputTypeAttribute;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  password?: boolean;
  defaultPassword?: boolean;
  clearable?: boolean;
  placeholder?: string;
  size?: Size;
  disabled?: boolean;
  inputProps?: React.ComponentPropsWithRef<'input'>;
  onModelChange?: (value: string) => void;
  onClear?: () => void;
  onPasswordChange?: (value: boolean) => void;
}

export interface InputNumberProps
  extends BaseProps<'input', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'prefix'> {
  formControl?: FormControlProvider;
  model?: number | null;
  defaultModel?: number | null;
  max?: number;
  min?: number;
  step?: number;
  integer?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  clearable?: boolean;
  placeholder?: string;
  size?: Size;
  numberButton?: boolean;
  disabled?: boolean;
  inputProps?: React.ComponentPropsWithRef<'input'>;
  onModelChange?: (value: number | null) => void;
  onClear?: () => void;
}
