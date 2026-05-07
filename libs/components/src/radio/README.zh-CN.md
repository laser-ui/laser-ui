---
title: 单选框
---

用于在多个互斥选项中选择一项。

## API

### RadioProps

```tsx
interface RadioProps extends BaseProps<'radio', typeof CLASSES>, React.LabelHTMLAttributes<HTMLLabelElement> {
  formControl?: FormControlProvider;
  model?: boolean;
  defaultModel?: boolean;
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
| disabled | 为 `true` 时，禁用组件 | `false` |
| onModelChange | 选中状态改变时的回调函数 | - |
<!-- prettier-ignore-end -->

### RadioGroupProps

```tsx
interface RadioGroupItem<V extends React.Key> {
  label: React.ReactNode;
  value: V;
  disabled?: boolean;
}

interface RadioGroupProps<V extends React.Key, T extends RadioGroupItem<V>> {
  children: (nodes: React.ReactElement[]) => React.ReactElement;
  formControl?: FormControlProvider;
  list: T[];
  model?: V | null;
  defaultModel?: V;
  pattern?: 'outline' | 'fill';
  size?: Size;
  name?: string;
  disabled?: boolean;
  onModelChange?: (value: V, origin: T) => void;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| formControl | 表单支持 | - |
| list | 配置选项 | - |
| model | 选中项 | `list` 首项 |
| defaultModel | 默认选中项 | - |
| pattern | 形态 | - |
| size | 大小 | `medium` |
| name | `input` 元素的 `name` 属性 | `useId` 生成 |
| disabled | 为 `true` 时，禁用组件 | `false` |
| onModelChange | 当选中项改变时的回调函数 | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  radio: '^radio',
  'radio.is-checked': 'is-checked',
  'radio.is-disabled': 'is-disabled',
  'radio--button': '^radio--button',
  'radio--button-outline': '^radio--button-outline',
  'radio--button-fill': '^radio--button-fill',
  'radio--button-small': '^radio--button-small',
  'radio--button-medium': '^radio--button-medium',
  'radio--button-large': '^radio--button-large',
  'radio__input-wrapper': '^radio__input-wrapper',
  radio__input: '^radio__input',
  radio__label: '^radio__label',
};
```
