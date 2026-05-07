---
title: 输入框
---

用于输入文本或数字的基础输入框组件。

## API

### InputProps

```tsx
interface InputProps extends BaseProps<'input', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'prefix'> {
  formControl?: FormControlProvider;
  model?: string;
  defaultModel?: string;
  type?: React.HTMLInputTypeAttribute;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  password?: boolean;
  defaultPassword?: boolean;
  clearable?: boolean;
  placeholder?: string;
  size?: Size;
  disabled?: boolean;
  inputProps?: React.ComponentPropsWithRef<'input'>;
  onModelChange?: (value: string) => void;
  onClear?: () => void;
  onPasswordChange?: (value: boolean) => void;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| formControl | 表单支持 | - |
| model | 输入框的值 | - |
| defaultModel | 默认值 | `''` |
| type | 输入框类型 | - |
| prefix | 前缀内容 | - |
| suffix | 后缀内容 | - |
| password | 是否显示密码 | - |
| defaultPassword | 默认密码可见性 | `true` |
| clearable | 为 `true` 时，显示清除按钮 | `false` |
| placeholder | 占位符文本 | - |
| size | 大小 | `medium` |
| disabled | 为 `true` 时，禁用组件 | `false` |
| inputProps | 原生 input 元素的额外属性 | - |
| onModelChange | 值改变时的回调函数 | - |
| onClear | 点击清除按钮时的回调函数 | - |
| onPasswordChange | 密码可见性改变时的回调函数 | - |
<!-- prettier-ignore-end -->

### InputNumberProps

```tsx
interface InputNumberProps extends BaseProps<'input', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'prefix'> {
  formControl?: FormControlProvider;
  model?: number | null;
  defaultModel?: number | null;
  max?: number;
  min?: number;
  step?: number;
  integer?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  clearable?: boolean;
  placeholder?: string;
  size?: Size;
  numberButton?: boolean;
  disabled?: boolean;
  inputProps?: React.ComponentPropsWithRef<'input'>;
  onModelChange?: (value: number | null) => void;
  onClear?: () => void;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| formControl | 表单支持 | - |
| model | 输入框的值 | - |
| defaultModel | 默认值 | `null` |
| max | 最大值 | - |
| min | 最小值 | - |
| step | 步进值 | `1` |
| integer | 为 `true` 时，仅允许整数 | `false` |
| prefix | 前缀内容 | - |
| suffix | 后缀内容 | - |
| clearable | 为 `true` 时，显示清除按钮 | `false` |
| placeholder | 占位符文本 | - |
| size | 大小 | `medium` |
| numberButton | 为 `true` 时，显示数字增减按钮 | `true` |
| disabled | 为 `true` 时，禁用组件 | `false` |
| inputProps | 原生 input 元素的额外属性 | - |
| onModelChange | 值改变时的回调函数 | - |
| onClear | 点击清除按钮时的回调函数 | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  input: '^input',
  'input.is-disabled': 'is-disabled',
  'input--small': '^input--small',
  'input--medium': '^input--medium',
  'input--large': '^input--large',
  input__prefix: '^input__prefix',
  input__input: '^input__input',
  input__clear: '^input__clear',
  input__password: '^input__password',
  input__suffix: '^input__suffix',
  'input__number-container': '^input__number-container',
  input__number: '^input__number',
};
```
