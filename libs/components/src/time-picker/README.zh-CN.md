---
title: 时间选择框
---

用于选择时间或时间范围。

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
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| formControl | 表单支持 | - |
| model | 选中的时间 | `null` |
| defaultModel | 默认选中的时间 | `null` |
| visible | 浮层是否可见 | `false` |
| defaultVisible | 浮层默认是否可见 | `false` |
| placeholder | 占位提示文字 | `'开始时间'` / `'结束时间'` / `'选择时间'` |
| range | 为 `true` 时，开启范围选择 | `false` |
| format | 时间格式化字符串 | `'HH:mm:ss'` |
| order | 范围值的排序，`false` 禁用排序 | `'ascend'` |
| clearable | 为 `true` 时，显示清除按钮 | `false` |
| size | 大小 | `'medium'` |
| disabled | 为 `true` 时，禁用组件 | `false` |
| config | 配置禁用或隐藏的选项 | - |
| escClosable | 为 `true` 时，按 Escape 键关闭浮层 | `true` |
| inputProps | 输入元素的属性 | - |
| onModelChange | 选中时间改变时的回调函数 | - |
| onVisibleChange | 浮层可见性改变时的回调函数 | - |
| onClear | 点击清除按钮时的回调函数 | - |
| afterVisibleChange | 浮层可见性动画完成后的回调函数 | - |
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
