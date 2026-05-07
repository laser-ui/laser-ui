---
title: 日期选择框
---

用于选择或输入日期。

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
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| ref | 组件的 ref | - |
| formControl | 表单支持 | - |
| model | 选中的日期 | - |
| defaultModel | 默认选中的日期 | - |
| visible | 弹出框是否可见 | - |
| defaultVisible | 弹出框默认是否可见 | `false` |
| placeholder | 占位符文本 | `'Select date'` / `'Start date'` / `'End date'` |
| range | 为 `true` 时，启用范围选择 | `false` |
| format | 日期格式字符串 | `'YYYY-MM-DD'` / `'YYYY-MM-DD HH:mm:ss'` |
| order | 范围日期的排序 | `'ascend'` |
| clearable | 为 `true` 时，显示清除按钮 | `false` |
| size | 大小 | `medium` |
| disabled | 为 `true` 时，禁用组件 | `false` |
| presetDate | 预设日期选项 | - |
| config | 配置禁用日期 | - |
| showTime | 为 `true` 时，显示时间选择器 | `false` |
| escClosable | 为 `true` 时，按 Esc 键关闭弹出框 | `true` |
| inputProps | `input` 元素的属性 | - |
| onModelChange | 选中日期改变时的回调函数 | - |
| onVisibleChange | 弹出框可见性改变时的回调函数 | - |
| onClear | 日期清除时的回调函数 | - |
| afterVisibleChange | 弹出框可见性改变后的回调函数 | - |
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
