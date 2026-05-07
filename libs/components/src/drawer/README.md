---
group: Feedback
title: Drawer
aria: dialogmodal
---

A panel that slides out from the edge of the screen.

## API

### DrawerProps

```tsx
interface DrawerProps extends BaseProps<'drawer', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  visible: boolean;
  header?: React.ReactElement | string;
  footer?: React.ReactElement;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  width?: number | string;
  height?: number | string;
  mask?: boolean;
  maskClosable?: boolean;
  escClosable?: boolean;
  container?: RefExtra;
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
| visible | Whether the drawer is visible | - |
| header | The header content | - |
| footer | The footer content | - |
| placement | The placement of the drawer | `'right'` |
| width | The width of the drawer | `400` |
| height | The height of the drawer | `280` |
| mask | If `true`, show the mask | `true` |
| maskClosable | If `true`, close the drawer when clicking the mask | `true` |
| escClosable | If `true`, close the drawer on Escape key | `true` |
| container | The container element | `document.body` |
| skipFirstTransition | If `true`, skip the first transition animation | `true` |
| destroyAfterClose | If `true`, destroy the content after closing | `false` |
| lazyLoading | If `true`, lazy load the content | `true` |
| zIndex | The z-index of the drawer | - |
| onClose | Callback fired when the drawer is closed | - |
| afterVisibleChange | Callback fired after the visibility changes | - |
<!-- prettier-ignore-end -->

### DrawerHeaderProps

```tsx
interface DrawerHeaderProps extends BaseProps<'drawer', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  actions?: (React.ReactNode | { id: React.Key; action: React.ReactNode })[];
  closeProps?: ButtonProps;
  onCloseClick?: () => any | Promise<any>;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| actions | The actions in the header | `['close']` |
| closeProps | The props of the close button | - |
| onCloseClick | Callback fired when the close button is clicked | - |
<!-- prettier-ignore-end -->

### DrawerFooterProps

```tsx
interface DrawerFooterProps extends BaseProps<'drawer', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
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
| align | The alignment of the footer actions | `'right'` |
| actions | The actions in the footer | `['cancel', 'ok']` |
| cancelProps | The props of the cancel button | - |
| okProps | The props of the ok button | - |
| onCancelClick | Callback fired when the cancel button is clicked | - |
| onOkClick | Callback fired when the ok button is clicked | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  drawer: '^drawer',
  'drawer--top': '^drawer--top',
  'drawer--right': '^drawer--right',
  'drawer--bottom': '^drawer--bottom',
  'drawer--left': '^drawer--left',
  drawer__content: '^drawer__content',
  drawer__header: '^drawer__header',
  'drawer__header-title': '^drawer__header-title',
  'drawer__header-actions': '^drawer__header-actions',
  drawer__body: '^drawer__body',
  drawer__footer: '^drawer__footer',
  'drawer__footer--left': '^drawer__footer--left',
  'drawer__footer--center': '^drawer__footer--center',
  'drawer__footer--right': '^drawer__footer--right',
};
```
