---
title: 开关
---

用于在两种状态之间切换的开关组件。

## API

### SwitchProps

```tsx
interface SwitchProps extends BaseProps<'switch', typeof CLASSES>, React.LabelHTMLAttributes<HTMLLabelElement> {
  formControl?: FormControlProvider;
  model?: boolean;
  defaultModel?: boolean;
  stateContent?: [React.ReactNode, React.ReactNode];
  labelPlacement?: 'left' | 'right';
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  inputProps?: React.ComponentPropsWithRef<'input'>;
  onModelChange?: (checked: boolean) => void;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| formControl | 表单支持 | - |
| model | 选中状态 | - |
| defaultModel | 默认选中状态 | `false` |
| stateContent | 选中和未选中状态的内容 | - |
| labelPlacement | 标签位置 | `'right'` |
| size | 大小 | `medium` |
| loading | 为 `true` 时，组件处于加载中 | `false` |
| disabled | 为 `true` 时，禁用组件 | `false` |
| inputProps | 输入元素的属性 | - |
| onModelChange | 选中状态改变时的回调函数 | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  switch: '^switch',
  'switch.is-checked': 'is-checked',
  'switch.is-loading': 'is-loading',
  'switch.is-disabled': 'is-disabled',
  'switch--label-left': '^switch--label-left',
  'switch--small': '^switch--small',
  'switch--medium': '^switch--medium',
  'switch--large': '^switch--large',
  'switch__state-container': '^switch__state-container',
  'switch__state-content': '^switch__state-content',
  'switch__state-content--left': '^switch__state-content--left',
  'switch__state-dot': '^switch__state-dot',
  switch__input: '^switch__input',
  switch__label: '^switch__label',
};
```
