import type { AbstractControl } from './model/abstract-control';
import type { CLASSES } from './vars';
import type { BaseProps, Size } from '../types';

export {};

export type FormErrors =
  | string
  | { message: string; invalid: 'warning' | 'error' }
  | { [index: string]: string | { message: string; invalid: 'warning' | 'error' } };

export interface FormControlProvider {
  control: AbstractControl;
  invalid: 'warning' | 'error' | false;
  inputAria: {
    'aria-invalid'?: boolean;
    'aria-describedby'?: string;
  };
}

export interface FormContextData {
  vertical: boolean;
  labelWidth: number | string | undefined;
  labelColon: boolean;
  requiredType: 'required' | 'optional' | 'hidden';
  feedbackIcon:
    | boolean
    | {
        success?: React.ReactNode;
        warning?: React.ReactNode;
        error?: React.ReactNode;
        pending?: React.ReactNode;
      };
}

export interface FormProps extends BaseProps<'form', typeof CLASSES>, React.FormHTMLAttributes<HTMLFormElement> {
  vertical?: boolean;
  labelWidth?: number | string;
  labelColon?: boolean;
  requiredType?: 'required' | 'optional' | 'hidden';
  feedbackIcon?:
    | boolean
    | {
        success?: React.ReactNode;
        warning?: React.ReactNode;
        error?: React.ReactNode;
        pending?: React.ReactNode;
      };
  size?: Size;
}

export interface FormItemProps<T extends { [index: string]: FormErrors }>
  extends BaseProps<'form', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children: React.ReactNode | ((formControls: { [N in keyof T]: FormControlProvider }) => React.ReactNode);
  formControls?: T;
  label?: React.ReactNode;
  labelWidth?: number | string;
  labelExtra?: { title: string; icon?: React.ReactElement } | string;
  labelFor?: string;
  required?: boolean;
}
