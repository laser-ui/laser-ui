import type { CLASSES } from './vars';
import type { FormControlProvider } from '../form/types';
import type { TimePickerProps } from '../time-picker';
import type { BaseProps, Size } from '../types';

export {};

export interface DatePickerRef {
  updatePosition: () => void;
}

export interface DatePickerProps
  extends BaseProps<'date-picker' | 'time-picker' | 'date-picker-popup', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'placeholder'> {
  ref?: React.Ref<DatePickerRef>;
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
  inputProps?: [React.ComponentPropsWithRef<'input'>?, React.ComponentPropsWithRef<'input'>?];
  onModelChange?: (date: any) => void;
  onVisibleChange?: (visible: boolean) => void;
  onClear?: () => void;
  afterVisibleChange?: (visible: boolean) => void;
}
