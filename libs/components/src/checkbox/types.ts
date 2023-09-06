import type { CLASSES } from './vars';
import type { FormControlProvider } from '../form/types';
import type { BaseProps, CloneHTMLElement } from '../types';

export {};

export interface CheckboxProps extends BaseProps<'checkbox', typeof CLASSES>, React.LabelHTMLAttributes<HTMLLabelElement> {
  formControl?: FormControlProvider;
  model?: boolean;
  defaultModel?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  inputRef?: React.ForwardedRef<HTMLInputElement>;
  inputRender?: CloneHTMLElement;
  onModelChange?: (checked: boolean) => void;
}

export interface CheckboxGroupItem<V extends React.Key> {
  label: React.ReactNode;
  value: V;
  disabled?: boolean;
}

export interface CheckboxGroupProps<V extends React.Key, T extends CheckboxGroupItem<V>> {
  children: (nodes: React.ReactElement[]) => React.ReactElement;
  formControl?: FormControlProvider;
  list: T[];
  model?: V[];
  defaultModel?: V[];
  disabled?: boolean;
  onModelChange?: (values: V[], origins: T[]) => void;
}
