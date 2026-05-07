---
title: 按钮
---

可点击的按钮组件。

## API

### ButtonProps

```tsx
interface ButtonProps extends BaseProps<'button', typeof CLASSES>, React.ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: React.Ref<HTMLButtonElement>;
  pattern?: 'primary' | 'secondary' | 'outline' | 'dashed' | 'text' | 'link';
  theme?: 'primary' | 'success' | 'warning' | 'danger';
  loading?: boolean;
  shape?: 'circle' | 'round';
  block?: boolean;
  size?: Size;
  icon?: React.ReactNode;
  iconRight?: boolean;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| ref | 按钮元素的 ref | - |
| pattern | 按钮的形态 | `'primary'` |
| theme | 主题色 | `'primary'` |
| loading | 为 `true` 时，显示加载状态 | `false` |
| shape | 按钮的形状 | - |
| block | 为 `true` 时，按钮占满整行 | `false` |
| size | 按钮的大小 | - |
| icon | 按钮的图标 | - |
| iconRight | 为 `true` 时，图标在右侧 | `false` |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  button: '^button',
  'button.t-primary': 't-primary',
  'button.t-success': 't-success',
  'button.t-warning': 't-warning',
  'button.t-danger': 't-danger',
  'button.is-loading': 'is-loading',
  'button--primary': '^button--primary',
  'button--secondary': '^button--secondary',
  'button--outline': '^button--outline',
  'button--dashed': '^button--dashed',
  'button--text': '^button--text',
  'button--link': '^button--link',
  'button--circle': '^button--circle',
  'button--round': '^button--round',
  'button--block': '^button--block',
  'button--small': '^button--small',
  'button--medium': '^button--medium',
  'button--large': '^button--large',
  'button--icon': '^button--icon',
  'button--icon-right': '^button--icon-right',
  button__icon: '^button__icon',
};
```
