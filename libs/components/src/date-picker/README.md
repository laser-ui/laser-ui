---
group: Data Entry
title: DatePicker
compose: true
---

For selecting or entering a date.

## API

### DatePickerProps

```tsx
interface DatePickerProps
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
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| ref | Ref for the component | - |
| formControl | Form support | - |
| model | The selected date | - |
| defaultModel | The default selected date | - |
| visible | Whether the popup is visible | - |
| defaultVisible | The default visibility of the popup | `false` |
| placeholder | The placeholder text | `'Select date'` / `'Start date'` / `'End date'` |
| range | If `true`, enable range selection | `false` |
| format | The date format string | `'YYYY-MM-DD'` / `'YYYY-MM-DD HH:mm:ss'` |
| order | The order of range dates | `'ascend'` |
| clearable | If `true`, show the clear button | `false` |
| size | Size | `medium` |
| disabled | If `true`, disable the component | `false` |
| presetDate | Preset date options | - |
| config | Configure disabled dates | - |
| showTime | If `true`, show time picker | `false` |
| escClosable | If `true`, close the popup on Escape key | `true` |
| inputProps | The props of the `input` elements | - |
| onModelChange | Callback fired when the selected date changes | - |
| onVisibleChange | Callback fired when the popup visibility changes | - |
| onClear | Callback fired when the date is cleared | - |
| afterVisibleChange | Callback fired after the popup visibility changes | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  'date-picker': '^date-picker',
  'date-picker.is-disabled': 'is-disabled',
  'date-picker--small': '^date-picker--small',
  'date-picker--medium': '^date-picker--medium',
  'date-picker--large': '^date-picker--large',
  'date-picker__input': '^date-picker__input',
  'date-picker__indicator': '^date-picker__indicator',
  'date-picker__separator': '^date-picker__separator',
  'date-picker__clear': '^date-picker__clear',
  'date-picker__icon': '^date-picker__icon',
  'date-picker-popup': '^date-picker-popup',
  'date-picker__preset': '^date-picker__preset',
  'date-picker__preset-option': '^date-picker__preset-option',
  'date-picker__panel-wrapper': '^date-picker__panel-wrapper',
  'date-picker__panel': '^date-picker__panel',
  'date-picker__header': '^date-picker__header',
  'date-picker__header-button': '^date-picker__header-button',
  'date-picker__header-date': '^date-picker__header-date',
  'date-picker__table': '^date-picker__table',
  'date-picker__cell': '^date-picker__cell',
  'date-picker__cell.is-active': 'is-active',
  'date-picker__cell.is-hover': 'is-hover',
  'date-picker__cell.is-between': 'is-between',
  'date-picker__cell.is-between-hover': 'is-between-hover',
  'date-picker__cell.is-disabled': 'is-disabled',
  'date-picker__cell--out-month': '^date-picker__cell--out-month',
  'date-picker__cell--today': '^date-picker__cell--today',
  'date-picker__footer': '^date-picker__footer',
  'time-picker__panel': '^time-picker__panel',
  'time-picker__header': '^time-picker__header',
  'time-picker__column': '^time-picker__column',
  'time-picker__cell': '^time-picker__cell',
  'time-picker__cell.is-active': 'is-active',
  'time-picker__cell.is-disabled': 'is-disabled',
};
```
