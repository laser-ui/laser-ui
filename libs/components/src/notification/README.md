---
group: Feedback
title: Notification
aria: alert
---

A notification message that appears in a corner of the screen.

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
| Property | Description | Default |
| --- | --- | --- |
| visible | Whether the notification is visible | - |
| title | The title of the notification | - |
| type | The type of notification | - |
| placement | The placement of the notification | `'right-top'` |
| duration | The duration in seconds before auto-closing, `0` to disable | `9.6` |
| icon | The custom icon | - |
| closable | If `true`, show the close button | `true` |
| escClosable | If `true`, close on Escape key | `true` |
| skipFirstTransition | If `true`, skip the first transition animation | `true` |
| destroyAfterClose | If `true`, destroy the content after closing | `false` |
| lazyLoading | If `true`, lazy load the content | `true` |
| onClose | Callback fired when the notification is closed | - |
| afterVisibleChange | Callback fired after the visibility changes | - |
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
