---
group: Data Display
title: Tooltip
aria: tooltip
---

Display a popup with additional information on hover or click.

Please refer to [Popover](/components/Popover) for how to deal with scrolling in the component's ancestor elements.

## API

### TooltipProps

```tsx
interface TooltipRef {
  updatePosition: () => void;
}

interface TooltipProps extends BaseProps<'tooltip', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  ref?: React.Ref<TooltipRef>;
  children: (props: {
    'aria-describedby': string;
    onClick: React.MouseEventHandler<HTMLElement>;
    onMouseEnter: React.MouseEventHandler<HTMLElement>;
    onMouseLeave: React.MouseEventHandler<HTMLElement>;
    onKeyDown: React.KeyboardEventHandler<HTMLElement>;
  }) => React.ReactNode;
  title: React.ReactNode;
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
| children | The trigger element render function | - |
| title | The content of the tooltip | - |
| visible | Whether the tooltip is visible | `false` |
| defaultVisible | The default visibility of the tooltip | `false` |
| trigger | The trigger mode | `'hover'` |
| placement | The placement of the tooltip | `'top'` |
| placementFixed | If `true`, the placement is fixed | `false` |
| arrow | If `true`, show the arrow | `true` |
| escClosable | If `true`, close on Escape key | `true` |
| gap | The gap between the tooltip and the trigger | `10` |
| inWindow | Keep the tooltip in the window, `false` disables | `false` |
| mouseEnterDelay | The delay before showing on mouse enter (ms) | `150` |
| mouseLeaveDelay | The delay before hiding on mouse leave (ms) | `200` |
| skipFirstTransition | If `true`, skip the first transition animation | `true` |
| destroyAfterClose | If `true`, destroy the content after closing | `false` |
| lazyLoading | If `true`, lazy render the content | `true` |
| zIndex | The z-index of the tooltip | - |
| onVisibleChange | Callback fired when the visibility changes | - |
| afterVisibleChange | Callback fired after the visibility animation | - |
<!-- prettier-ignore-end -->

### TooltipRef

```tsx
interface TooltipRef {
  updatePosition: () => void;
}
```

### CSS

```tsx
const CLASSES = {
  tooltip: '^tooltip',
  'tooltip--top': '^tooltip--top',
  'tooltip--top-left': '^tooltip--top-left',
  'tooltip--top-right': '^tooltip--top-right',
  'tooltip--right': '^tooltip--right',
  'tooltip--right-top': '^tooltip--right-top',
  'tooltip--right-bottom': '^tooltip--right-bottom',
  'tooltip--bottom': '^tooltip--bottom',
  'tooltip--bottom-left': '^tooltip--bottom-left',
  'tooltip--bottom-right': '^tooltip--bottom-right',
  'tooltip--left': '^tooltip--left',
  'tooltip--left-top': '^tooltip--left-top',
  'tooltip--left-bottom': '^tooltip--left-bottom',
  tooltip__arrow: '^tooltip__arrow',
};
```
