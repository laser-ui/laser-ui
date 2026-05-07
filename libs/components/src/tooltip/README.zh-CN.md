---
title: 文字提示
---

在悬停或点击时显示包含额外信息的弹出框。

处理组件的祖先元素中包含滚动的情况请参考 [Popover](/components/Popover)。

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
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| children | 触发元素的渲染函数 | - |
| title | 文字提示的内容 | - |
| visible | 文字提示是否可见 | `false` |
| defaultVisible | 文字提示默认是否可见 | `false` |
| trigger | 触发模式 | `'hover'` |
| placement | 文字提示的位置 | `'top'` |
| placementFixed | 为 `true` 时，位置固定 | `false` |
| arrow | 为 `true` 时，显示箭头 | `true` |
| escClosable | 为 `true` 时，按 Escape 键关闭 | `true` |
| gap | 文字提示与触发元素之间的间隙 | `10` |
| inWindow | 将文字提示保持在窗口内，`false` 禁用 | `false` |
| mouseEnterDelay | 鼠标进入后显示的延迟（毫秒） | `150` |
| mouseLeaveDelay | 鼠标离开后隐藏的延迟（毫秒） | `200` |
| skipFirstTransition | 为 `true` 时，跳过第一次过渡动画 | `true` |
| destroyAfterClose | 为 `true` 时，关闭后销毁内容 | `false` |
| lazyLoading | 为 `true` 时，懒渲染内容 | `true` |
| zIndex | 文字提示的 z-index | - |
| onVisibleChange | 可见性改变时的回调函数 | - |
| afterVisibleChange | 可见性动画完成后的回调函数 | - |
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
