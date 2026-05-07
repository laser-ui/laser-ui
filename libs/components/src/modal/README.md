---
group: Feedback
title: Modal
aria: dialogmodal
---

A dialog box for displaying important content or collecting user input.

## API

### ModalProps

```tsx
interface ModalProps extends BaseProps<'modal', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  visible: boolean;
  header?: React.ReactElement | string;
  footer?: React.ReactElement;
  alert?: React.ReactElement;
  width?: number | string;
  top?: number | string;
  mask?: boolean;
  maskClosable?: boolean;
  escClosable?: boolean;
  skipFirstTransition?: boolean;
  destroyAfterClose?: boolean;
  lazyLoading?: boolean;
  zIndex?: number | string;
  onClose?: () => void;
  afterVisibleChange?: (visible: boolean) => void;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| visible | Whether the modal is visible | - |
| header | The header content | - |
| footer | The footer content | - |
| alert | The alert content | - |
| width | The width of the modal | `520` |
| top | The distance from the top, or `'center'` to center vertically | `100` |
| mask | If `true`, show the mask | `true` |
| maskClosable | If `true`, close the modal when clicking the mask | `true` |
| escClosable | If `true`, close the modal on Escape key | `true` |
| skipFirstTransition | If `true`, skip the first transition animation | `true` |
| destroyAfterClose | If `true`, destroy the content after closing | `false` |
| lazyLoading | If `true`, lazy load the content | `true` |
| zIndex | The z-index of the modal | - |
| onClose | Callback fired when the modal is closed | - |
| afterVisibleChange | Callback fired after the visibility changes | - |
<!-- prettier-ignore-end -->

### ModalHeaderProps

```tsx
interface ModalHeaderProps extends BaseProps<'modal', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  actions?: (React.ReactNode | { id: React.Key; action: React.ReactNode })[];
  closeProps?: ButtonProps;
  onCloseClick?: () => any | Promise<any>;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| actions | The header actions | `['close']` |
| closeProps | Props for the close button | - |
| onCloseClick | Callback fired when the close button is clicked | - |
<!-- prettier-ignore-end -->

### ModalFooterProps

```tsx
interface ModalFooterProps extends BaseProps<'modal', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  align?: 'left' | 'center' | 'right';
  actions?: (React.ReactNode | { id: React.Key; action: React.ReactNode })[];
  cancelProps?: ButtonProps;
  okProps?: ButtonProps;
  onCancelClick?: () => any | Promise<any>;
  onOkClick?: () => any | Promise<any>;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| align | The alignment of the footer | `'right'` |
| actions | The footer actions | `['cancel', 'ok']` |
| cancelProps | Props for the cancel button | - |
| okProps | Props for the ok button | - |
| onCancelClick | Callback fired when the cancel button is clicked | - |
| onOkClick | Callback fired when the ok button is clicked | - |
<!-- prettier-ignore-end -->

### ModalAlertProps

```tsx
interface ModalAlertProps extends BaseProps<'modal', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  type: 'success' | 'warning' | 'error' | 'info';
  title?: React.ReactNode;
  icon?: React.ReactNode;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| type | The alert type | - |
| title | The alert title | - |
| icon | The alert icon | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  modal: '^modal',
  'modal--center': '^modal--center',
  'modal--alert': '^modal--alert',
  modal__content: '^modal__content',
  modal__header: '^modal__header',
  'modal__header-title': '^modal__header-title',
  'modal__header-actions': '^modal__header-actions',
  modal__body: '^modal__body',
  modal__footer: '^modal__footer',
  'modal__footer--left': '^modal__footer--left',
  'modal__footer--center': '^modal__footer--center',
  'modal__footer--right': '^modal__footer--right',
  modal__alert: '^modal__alert',
  'modal__alert--success': '^modal__alert--success',
  'modal__alert--warning': '^modal__alert--warning',
  'modal__alert--error': '^modal__alert--error',
  'modal__alert--info': '^modal__alert--info',
  'modal__alert-icon': '^modal__alert-icon',
  'modal__alert-content': '^modal__alert-content',
  'modal__alert-title': '^modal__alert-title',
  'modal__alert-message': '^modal__alert-message',
};
```
