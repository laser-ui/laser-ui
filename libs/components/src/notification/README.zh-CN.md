---
title: 通知
---

出现在屏幕角落的通知消息。

## API

### NotificationProps

```tsx
interface NotificationProps extends BaseProps<'notification', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  visible: boolean;
  title: React.ReactNode;
  type?: 'success' | 'warning' | 'error' | 'info';
  placement?: 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom';
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
| visible | 是否可见 | - |
| title | 通知标题 | - |
| type | 通知类型 | - |
| placement | 通知位置 | `'right-top'` |
| duration | 自动关闭前的持续时间（秒），`0` 表示不自动关闭 | `9.6` |
| icon | 自定义图标 | - |
| closable | 为 `true` 时，显示关闭按钮 | `true` |
| escClosable | 为 `true` 时，按 Esc 键关闭 | `true` |
| skipFirstTransition | 为 `true` 时，跳过首次过渡动画 | `true` |
| destroyAfterClose | 为 `true` 时，关闭后销毁内容 | `false` |
| lazyLoading | 为 `true` 时，懒加载内容 | `true` |
| onClose | 关闭时的回调函数 | - |
| afterVisibleChange | 可见性改变后的回调函数 | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  notification: '^notification',
  'notification--success': '^notification--success',
  'notification--warning': '^notification--warning',
  'notification--error': '^notification--error',
  'notification--info': '^notification--info',
  notification__icon: '^notification__icon',
  notification__content: '^notification__content',
  notification__header: '^notification__header',
  notification__title: '^notification__title',
  notification__close: '^notification__close',
  notification__description: '^notification__description',
};
```
