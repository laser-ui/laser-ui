---
group: Data Entry
title: Input
compose: true
---

A basic input component for entering text or numbers.

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
| Property | Description | Default |
| --- | --- | --- |
| formControl | Form support | - |
| model | The input value | - |
| defaultModel | The default input value | `''` |
| type | The type of input | - |
| prefix | The prefix content | - |
| suffix | The suffix content | - |
| password | Whether to show password | - |
| defaultPassword | The default password visibility | `true` |
| clearable | If `true`, show the clear button | `false` |
| placeholder | The placeholder text | - |
| size | Size | `medium` |
| disabled | If `true`, disable the component | `false` |
| inputProps | Additional props for the native input element | - |
| onModelChange | Callback fired when the value changes | - |
| onClear | Callback fired when the clear button is clicked | - |
| onPasswordChange | Callback fired when the password visibility changes | - |
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
| Property | Description | Default |
| --- | --- | --- |
| formControl | Form support | - |
| model | The input value | - |
| defaultModel | The default input value | `null` |
| max | The maximum value | - |
| min | The minimum value | - |
| step | The step value | `1` |
| integer | If `true`, only allow integer values | `false` |
| prefix | The prefix content | - |
| suffix | The suffix content | - |
| clearable | If `true`, show the clear button | `false` |
| placeholder | The placeholder text | - |
| size | Size | `medium` |
| numberButton | If `true`, show the number increment/decrement buttons | `true` |
| disabled | If `true`, disable the component | `false` |
| inputProps | Additional props for the native input element | - |
| onModelChange | Callback fired when the value changes | - |
| onClear | Callback fired when the clear button is clicked | - |
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
