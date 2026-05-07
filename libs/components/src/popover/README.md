---
group: General
title: Popover
---

A floating card that appears near a trigger element.

## API

### PopoverProps

```tsx
interface PopoverProps extends BaseProps<'popover', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'content'> {
  ref?: React.Ref<PopoverRef>;
  children: (props: {
    id: string;
    onClick: React.MouseEventHandler<HTMLElement>;
    onMouseEnter: React.MouseEventHandler<HTMLElement>;
    onMouseLeave: React.MouseEventHandler<HTMLElement>;
    onKeyDown: React.KeyboardEventHandler<HTMLElement>;
  }) => React.ReactNode;
  content: React.ReactNode;
  header?: React.ReactElement | string;
  footer?: React.ReactElement;
  visible?: boolean;
  defaultVisible?: boolean;
  trigger?: 'hover' | 'click';
  placement?: PopupPlacement;
  placementFixed?: boolean;
  arrow?: boolean;
  escClosable?: boolean;
  gap?: number;
  inWindow?: number | false;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  modal?: boolean;
  skipFirstTransition?: boolean;
  destroyAfterClose?: boolean;
  lazyLoading?: boolean;
  zIndex?: number | string;
  onVisibleChange?: (visible: boolean) => void;
  afterVisibleChange?: (visible: boolean) => void;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| ref | Ref for the component | - |
| children | Render prop for the trigger element | - |
| content | The content of the popover | - |
| header | The header content | - |
| footer | The footer content | - |
| visible | Whether the popover is visible | - |
| defaultVisible | The default visibility | `false` |
| trigger | The trigger mode | `'hover'` |
| placement | The placement of the popover | `'top'` |
| placementFixed | If `true`, fix the placement | `false` |
| arrow | If `true`, show the arrow | `true` |
| escClosable | If `true`, close on Escape key | `true` |
| gap | The gap between the popover and the trigger | `10` |
| inWindow | Keep the popover in the window, specify the padding | `false` |
| mouseEnterDelay | The delay before showing on mouse enter (ms) | `150` |
| mouseLeaveDelay | The delay before hiding on mouse leave (ms) | `200` |
| modal | If `true`, the popover acts as a modal dialog | `false` |
| skipFirstTransition | If `true`, skip the first transition animation | `true` |
| destroyAfterClose | If `true`, destroy the content after closing | `false` |
| lazyLoading | If `true`, lazy load the content | `true` |
| zIndex | The z-index of the popover | - |
| onVisibleChange | Callback fired when the visibility changes | - |
| afterVisibleChange | Callback fired after the visibility changes | - |
<!-- prettier-ignore-end -->

### PopoverHeaderProps

```tsx
interface PopoverHeaderProps extends BaseProps<'popover', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  actions?: (React.ReactNode | { id: React.Key; action: React.ReactNode })[];
  closeProps?: ButtonProps;
  onCloseClick?: () => any | Promise<any>;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| actions | The header actions | `[]` |
| closeProps | Props for the close button | - |
| onCloseClick | Callback fired when the close button is clicked | - |
<!-- prettier-ignore-end -->

### PopoverFooterProps

```tsx
interface PopoverFooterProps extends BaseProps<'popover', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
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

### CSS

```tsx
const CLASSES = {
  popover: '^popover',
  'popover--top': '^popover--top',
  'popover--top-left': '^popover--top-left',
  'popover--top-right': '^popover--top-right',
  'popover--right': '^popover--right',
  'popover--right-top': '^popover--right-top',
  'popover--right-bottom': '^popover--right-bottom',
  'popover--bottom': '^popover--bottom',
  'popover--bottom-left': '^popover--bottom-left',
  'popover--bottom-right': '^popover--bottom-right',
  'popover--left': '^popover--left',
  'popover--left-top': '^popover--left-top',
  'popover--left-bottom': '^popover--left-bottom',
  popover__mask: '^popover__mask',
  popover__content: '^popover__content',
  popover__arrow: '^popover__arrow',
  popover__header: '^popover__header',
  'popover__header-title': '^popover__header-title',
  'popover__header-actions': '^popover__header-actions',
  popover__body: '^popover__body',
  popover__footer: '^popover__footer',
  'popover__footer--left': '^popover__footer--left',
  'popover__footer--center': '^popover__footer--center',
  'popover__footer--right': '^popover__footer--right',
};
```
