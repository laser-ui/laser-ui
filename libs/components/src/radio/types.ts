import type { CLASSES } from './vars';
import type { FormControlProvider } from '../form/types';
import type { BaseProps, CloneHTMLElement, Size } from '../types';

export {};

export interface RadioProps extends BaseProps<'radio', typeof CLASSES>, React.LabelHTMLAttributes<HTMLLabelElement> {
  formControl?: FormControlProvider;
  model?: boolean;
  defaultModel?: boolean;
  disabled?: boolean;
  inputRef?: React.ForwardedRef<HTMLInputElement>;
  inputRender?: CloneHTMLElement;
  onModelChange?: (checked: boolean) => void;
}

export interface RadioGroupItem<V extends React.Key> {
  label: React.ReactNode;
  value: V;
  disabled?: boolean;
}

export interface RadioGroupProps<V extends React.Key, T extends RadioGroupItem<V>> {
  children: (nodes: React.ReactElement[]) => React.ReactElement;
  formControl?: FormControlProvider;
  list: T[];
  model?: V | null;
  defaultModel?: V;
  pattern?: 'outline' | 'fill';
  size?: Size;
  name?: string;
  disabled?: boolean;
  onModelChange?: (value: V, origin: T) => void;
}
