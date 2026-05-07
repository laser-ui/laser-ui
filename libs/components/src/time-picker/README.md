---
group: Data Entry
title: TimePicker
compose: true
---

For selecting a time or time range.

## API

### TimePickerProps

```tsx
interface TimePickerProps extends BaseProps<'time-picker' | 'time-picker-popup', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'placeholder'> {
  ref?: React.Ref<TimePickerRef>;
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
| formControl | Form support | - |
| model | The selected time | `null` |
| defaultModel | The default selected time | `null` |
| visible | Whether the popup is visible | `false` |
| defaultVisible | The default visibility of the popup | `false` |
| placeholder | The placeholder text | `'Start time'` / `'End time'` / `'Select time'` |
| range | If `true`, enable range selection | `false` |
| format | The time format string | `'HH:mm:ss'` |
| order | The order of range values, `false` disables ordering | `'ascend'` |
| clearable | If `true`, show the clear button | `false` |
| size | Size | `'medium'` |
| disabled | If `true`, disable the component | `false` |
| config | Configure disabled or hidden options | - |
| escClosable | If `true`, close the popup on Escape key | `true` |
| inputProps | Props for the input elements | - |
| onModelChange | Callback fired when the selected time changes | - |
| onVisibleChange | Callback fired when the popup visibility changes | - |
| onClear | Callback fired when the clear button is clicked | - |
| afterVisibleChange | Callback fired after the popup visibility animation | - |
<!-- prettier-ignore-end -->

### TimePickerRef

```tsx
interface TimePickerRef {
  updatePosition: () => void;
}
```

### CSS

```tsx
const CLASSES = {
  'time-picker': '^time-picker',
  'time-picker.is-disabled': 'is-disabled',
  'time-picker--small': '^time-picker--small',
  'time-picker--medium': '^time-picker--medium',
  'time-picker--large': '^time-picker--large',
  'time-picker__input': '^time-picker__input',
  'time-picker__indicator': '^time-picker__indicator',
  'time-picker__separator': '^time-picker__separator',
  'time-picker__clear': '^time-picker__clear',
  'time-picker__icon': '^time-picker__icon',
  'time-picker-popup': '^time-picker-popup',
  'time-picker__panel': '^time-picker__panel',
  'time-picker__header': '^time-picker__header',
  'time-picker__column': '^time-picker__column',
  'time-picker__cell': '^time-picker__cell',
  'time-picker__cell.is-active': 'is-active',
  'time-picker__cell.is-disabled': 'is-disabled',
  'time-picker__footer': '^time-picker__footer',
};
```
