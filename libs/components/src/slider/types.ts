import type { CLASSES } from './vars';
import type { FormControlProvider } from '../form/types';
import type { BaseProps, CloneHTMLElement } from '../types';

export {};

export interface SliderProps extends BaseProps<'slider', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  formControl?: FormControlProvider;
  model?: number | [number, number];
  defaultModel?: number | [number, number];
  max?: number;
  min?: number;
  step?: number | null;
  range?: boolean;
  rangeMinDistance?: number;
  rangeThumbDraggable?: boolean;
  tooltip?: boolean | [boolean?, boolean?];
  customTooltip?: (value: number) => React.ReactNode;
  marks?: number | ({ value: number; label: React.ReactNode } | number)[];
  vertical?: boolean;
  reverse?: boolean;
  disabled?: boolean;
  inputRef?: [React.ForwardedRef<HTMLInputElement>?, React.ForwardedRef<HTMLInputElement>?];
  inputRender?: [CloneHTMLElement?, CloneHTMLElement?];
  onModelChange?: (value: any) => void;
}
