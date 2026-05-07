---
title: 警告提示
---

用于显示需要用户注意的提示信息。

## API

### AlertProps

```tsx
interface AlertProps extends BaseProps<'alert', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  visible?: boolean;
  type?: 'success' | 'warning' | 'error' | 'info';
  title?: React.ReactNode;
  icon?: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
  afterVisibleChange?: (visible: boolean) => void;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| visible | 为 `true` 时，显示警告提示 | `true` |
| type | 警告提示的类型 | - |
| title | 警告提示的标题 | - |
| icon | 自定义图标，设为 `false` 隐藏 | - |
| closable | 为 `true` 时，显示关闭按钮 | `false` |
| onClose | 关闭时的回调函数 | - |
| afterVisibleChange | 可见性动画完成后的回调函数 | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  alert: '^alert',
  'alert--success': '^alert--success',
  'alert--warning': '^alert--warning',
  'alert--error': '^alert--error',
  'alert--info': '^alert--info',
  'alert--with-title': '^alert--with-title',
  alert__icon: '^alert__icon',
  alert__content: '^alert__content',
  alert__message: '^alert__message',
  alert__header: '^alert__header',
  alert__title: '^alert__title',
  alert__close: '^alert__close',
};
```
