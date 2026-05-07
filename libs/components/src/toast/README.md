---
group: Feedback
title: Toast
aria: alert
---

Display a brief message that auto-dismisses.

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
| Property | Description | Default |
| --- | --- | --- |
| visible | Whether the toast is visible | - |
| type | The type of toast | - |
| placement | The placement of the toast | `'top'` |
| duration | The duration in seconds before auto-dismiss, `0` disables auto-dismiss | `2` |
| icon | Custom icon, `false` hides the icon | - |
| closable | If `true`, show the close button | `false` |
| escClosable | If `true`, close on Escape key | `true` |
| skipFirstTransition | If `true`, skip the first transition animation | `true` |
| destroyAfterClose | If `true`, destroy the content after closing | `false` |
| lazyLoading | If `true`, lazy render the content | `true` |
| onClose | Callback fired when the toast is closed | - |
| afterVisibleChange | Callback fired after the visibility animation | - |
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
