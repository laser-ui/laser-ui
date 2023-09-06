import type { CLASSES } from './vars';
import type { FormControlProvider } from '../form/types';
import type { BaseProps, CloneHTMLElement, Size } from '../types';

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
  inputRef?: React.ForwardedRef<HTMLInputElement>;
  inputRender?: CloneHTMLElement;
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
  inputRef?: React.ForwardedRef<HTMLInputElement>;
  inputRender?: CloneHTMLElement;
  onModelChange?: (value: number | null) => void;
  onClear?: () => void;
}
