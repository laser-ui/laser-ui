import type { CLASSES } from './vars';
import type { FormControlProvider } from '../form/types';
import type { TimePickerProps } from '../time-picker';
import type { BaseProps, CloneHTMLElement, Size } from '../types';

export {};

export interface DatePickerRef {
  updatePosition: () => void;
}

export interface DatePickerProps
  extends BaseProps<'date-picker' | 'time-picker' | 'date-picker-popup', typeof CLASSES>,
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
  presetDate?: { [index: string]: () => Date | [Date, Date] };
  config?: (date: Date, position: 'start' | 'end', current: [Date | null, Date | null]) => { disabled?: boolean };
  showTime?: boolean | Pick<TimePickerProps, 'config'>;
  escClosable?: boolean;
  inputRef?: [React.ForwardedRef<HTMLInputElement>?, React.ForwardedRef<HTMLInputElement>?];
  inputRender?: [CloneHTMLElement?, CloneHTMLElement?];
  onModelChange?: (date: any) => void;
  onVisibleChange?: (visible: boolean) => void;
  onClear?: () => void;
  afterVisibleChange?: (visible: boolean) => void;
}
