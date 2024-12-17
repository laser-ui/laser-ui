import type { CLASSES } from './vars';
import type { FormControlProvider } from '../form/types';
import type { BaseProps } from '../types';

export {};

export interface CheckboxProps extends BaseProps<'checkbox', typeof CLASSES>, React.LabelHTMLAttributes<HTMLLabelElement> {
  formControl?: FormControlProvider;
  model?: boolean;
  defaultModel?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  inputProps?: React.ComponentPropsWithRef<'input'>;
  onModelChange?: (checked: boolean) => void;
}

export interface CheckboxGroupItem<V extends React.Key> {
  label: React.ReactNode;
  value: V;
  disabled?: boolean;
}

export interface CheckboxGroupProps<V extends React.Key, T extends CheckboxGroupItem<V>> {
  children: (
    props: { role: 'group' },
    optionProps: (option: T) => {
      children: React.ReactNode;
      model: boolean;
      disabled: boolean;
      inputProps?: {
        'aria-invalid'?: boolean;
        'aria-describedby'?: string;
      };
      onModelChange: (checked: boolean) => void;
    },
    options: T[],
  ) => React.ReactElement | null;
  formControl?: FormControlProvider;
  list: T[];
  model?: V[];
  defaultModel?: V[];
  disabled?: boolean;
  onModelChange?: (values: V[], origins: T[]) => void;
}
