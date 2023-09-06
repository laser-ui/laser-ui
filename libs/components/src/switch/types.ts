import type { CLASSES } from './vars';
import type { FormControlProvider } from '../form/types';
import type { BaseProps, CloneHTMLElement, Size } from '../types';

export {};

export interface SwitchProps extends BaseProps<'switch', typeof CLASSES>, React.LabelHTMLAttributes<HTMLLabelElement> {
  formControl?: FormControlProvider;
  model?: boolean;
  defaultModel?: boolean;
  stateContent?: [React.ReactNode, React.ReactNode];
  labelPlacement?: 'left' | 'right';
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  inputRef?: React.ForwardedRef<HTMLInputElement>;
  inputRender?: CloneHTMLElement;
  onModelChange?: (checked: boolean) => void;
}
