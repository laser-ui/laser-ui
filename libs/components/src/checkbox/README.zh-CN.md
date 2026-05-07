---
title: 多选框
---

用于在多个选项中进行多选。

## API

### CheckboxProps

```tsx
interface CheckboxProps extends BaseProps<'checkbox', typeof CLASSES>, React.LabelHTMLAttributes<HTMLLabelElement> {
  formControl?: FormControlProvider;
  model?: boolean;
  defaultModel?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  inputProps?: React.ComponentPropsWithRef<'input'>;
  onModelChange?: (checked: boolean) => void;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| formControl | 表单支持 | - |
| model | 指定当前是否选中 | `false` |
| defaultModel | 默认是否选中 | - |
| indeterminate | 半选状态 | `false` |
| disabled | 为 `true` 时，禁用组件 | `false` |
| inputProps | `input` 元素的属性 | - |
| onModelChange | 选中状态改变时的回调函数 | - |
<!-- prettier-ignore-end -->

### CheckboxGroupProps

```tsx
interface CheckboxGroupItem<V extends React.Key> {
  label: React.ReactNode;
  value: V;
  disabled?: boolean;
}

interface CheckboxGroupProps<V extends React.Key, T extends CheckboxGroupItem<V>> {
  children: (
    props: { role: 'group' },
    optionProps: (option: T) => {
      children: React.ReactNode;
      model: boolean;
      disabled: boolean;
      inputProps?: {
        'aria-invalid'?: boolean;
        'aria-describedby'?: string;
      };
      onModelChange: (checked: boolean) => void;
    },
    options: T[],
  ) => React.ReactElement | null;
  formControl?: FormControlProvider;
  list: T[];
  model?: V[];
  defaultModel?: V[];
  disabled?: boolean;
  onModelChange?: (values: V[], origins: T[]) => void;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| formControl | 表单支持 | - |
| list | 配置选项 | - |
| model | 选中项 | `[]` |
| defaultModel | 默认选中项 | - |
| disabled | 为 `true` 时，禁用组件 | `false` |
| onModelChange | 当选中项改变时的回调函数 | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  checkbox: '^checkbox',
  'checkbox.is-checked': 'is-checked',
  'checkbox.is-indeterminate': 'is-indeterminate',
  'checkbox.is-disabled': 'is-disabled',
  'checkbox__state-container': '^checkbox__state-container',
  checkbox__input: '^checkbox__input',
  checkbox__indeterminate: '^checkbox__indeterminate',
  checkbox__tick: '^checkbox__tick',
  checkbox__label: '^checkbox__label',
};
```
