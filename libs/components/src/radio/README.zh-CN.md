---
title: 单选框
---

`Radio` 组件。

## API

### RadioProps

```tsx
interface RadioProps extends BaseProps<'radio', typeof CLASSES>, React.LabelHTMLAttributes<HTMLLabelElement> {
  formControl?: FormControlProvider;
  model?: boolean;
  disabled?: boolean;
  inputRef?: React.ForwardedRef<HTMLInputElement>;
  inputRender?: CloneHTMLElement;
  onModelChange?: (checked: boolean) => void;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| formControl | 表单支持 | - |
| model | 是否选中 | `false` |
| defaultModel | 默认选中 | - |
| size | 大小 | `medium` |
| disabled | 为 `true` 时，禁用组件 | `false` |
| inputRef | 传递 `ref` 给 `input` 元素 | - |
| inputRender | 自定义 `input` 元素的渲染 | - |
| onModelChange | 当选中改变时触发回调 | - |
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
| onModelChange | 当选中项改变时触发回调 | - |
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
  'radio--small': '^radio--small',
  'radio--medium': '^radio--medium',
  'radio--large': '^radio--large',
  radio__indicator: '^radio__indicator',
  'radio__input-wrapper': '^radio__input-wrapper',
  radio__input: '^radio__input',
  radio__label: '^radio__label',
};
```
