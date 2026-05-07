---
group: Feedback
title: Alert
aria: alert
---

Display a callout for user attention.

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
| Property | Description | Default |
| --- | --- | --- |
| visible | If `true`, show the alert | `true` |
| type | The type of the alert | - |
| title | The title of the alert | - |
| icon | Custom icon, set to `false` to hide | - |
| closable | If `true`, show the close button | `false` |
| onClose | Callback fired when the alert is closed | - |
| afterVisibleChange | Callback fired after the visibility animation completes | - |
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
