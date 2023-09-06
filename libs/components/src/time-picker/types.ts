import type { CLASSES } from './vars';
import type { FormControlProvider } from '../form/types';
import type { BaseProps, CloneHTMLElement, Size } from '../types';

export {};

export interface TimePickerRef {
  updatePosition: () => void;
}

export interface TimePickerProps
  extends BaseProps<'time-picker' | 'time-picker-popup', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'placeholder'> {
  formControl?: FormControlProvider;
  model?: Date | [Date, Date] | null;
  defaultModel?: Date | [Date, Date] | null;
  visible?: boolean;
  defaultVisible?: boolean;
  placeholder?: string | [string?, string?];
  range?: boolean;
  format?: string;
  order?: 'ascend' | 'descend' | false;
  clearable?: boolean;
  size?: Size;
  disabled?: boolean;
  config?: (
    unit: 'hour' | 'minute' | 'second',
    value: number,
    position: 'start' | 'end',
    current: [Date | null, Date | null],
  ) => { disabled?: boolean; hidden?: boolean };
  escClosable?: boolean;
  inputRef?: [React.ForwardedRef<HTMLInputElement>?, React.ForwardedRef<HTMLInputElement>?];
  inputRender?: [CloneHTMLElement?, CloneHTMLElement?];
  onModelChange?: (date: any) => void;
  onVisibleChange?: (visible: boolean) => void;
  onClear?: () => void;
  afterVisibleChange?: (visible: boolean) => void;
}
