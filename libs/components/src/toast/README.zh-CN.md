---
title: 提示
---

显示一条自动消失的简短消息。

## API

### ToastProps

```tsx
interface ToastProps extends BaseProps<'toast', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  visible: boolean;
  type?: 'success' | 'warning' | 'error' | 'info';
  placement?: 'top' | 'bottom';
  duration?: number;
  icon?: React.ReactNode;
  closable?: boolean;
  escClosable?: boolean;
  skipFirstTransition?: boolean;
  destroyAfterClose?: boolean;
  lazyLoading?: boolean;
  onClose?: () => void;
  afterVisibleChange?: (visible: boolean) => void;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| visible | 提示是否可见 | - |
| type | 提示类型 | - |
| placement | 提示位置 | `'top'` |
| duration | 自动消失的持续时间（秒），`0` 禁用自动消失 | `2` |
| icon | 自定义图标，`false` 隐藏图标 | - |
| closable | 为 `true` 时，显示关闭按钮 | `false` |
| escClosable | 为 `true` 时，按 Escape 键关闭 | `true` |
| skipFirstTransition | 为 `true` 时，跳过第一次过渡动画 | `true` |
| destroyAfterClose | 为 `true` 时，关闭后销毁内容 | `false` |
| lazyLoading | 为 `true` 时，懒渲染内容 | `true` |
| onClose | 提示关闭时的回调函数 | - |
| afterVisibleChange | 可见性动画完成后的回调函数 | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  toast: '^toast',
  'toast--success': '^toast--success',
  'toast--warning': '^toast--warning',
  'toast--error': '^toast--error',
  'toast--info': '^toast--info',
  toast__icon: '^toast__icon',
  toast__message: '^toast__message',
  toast__close: '^toast__close',
};
```
