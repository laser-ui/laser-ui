---
title: 弹出框
---

出现在触发元素附近的浮动卡片。

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
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| ref | 组件的 ref | - |
| children | 触发元素的渲染函数 | - |
| content | 弹出框内容 | - |
| header | 头部内容 | - |
| footer | 底部内容 | - |
| visible | 是否可见 | - |
| defaultVisible | 默认是否可见 | `false` |
| trigger | 触发模式 | `'hover'` |
| placement | 弹出框位置 | `'top'` |
| placementFixed | 为 `true` 时，固定位置 | `false` |
| arrow | 为 `true` 时，显示箭头 | `true` |
| escClosable | 为 `true` 时，按 Esc 键关闭 | `true` |
| gap | 弹出框与触发元素之间的间隙 | `10` |
| inWindow | 将弹出框保持在窗口内，指定边距 | `false` |
| mouseEnterDelay | 鼠标进入后显示的延迟（毫秒） | `150` |
| mouseLeaveDelay | 鼠标离开后隐藏的延迟（毫秒） | `200` |
| modal | 为 `true` 时，弹出框作为模态对话框 | `false` |
| skipFirstTransition | 为 `true` 时，跳过首次过渡动画 | `true` |
| destroyAfterClose | 为 `true` 时，关闭后销毁内容 | `false` |
| lazyLoading | 为 `true` 时，懒加载内容 | `true` |
| zIndex | 弹出框的 z-index | - |
| onVisibleChange | 可见性改变时的回调函数 | - |
| afterVisibleChange | 可见性改变后的回调函数 | - |
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
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| actions | 头部操作 | `[]` |
| closeProps | 关闭按钮的属性 | - |
| onCloseClick | 点击关闭按钮时的回调函数 | - |
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
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| align | 底部对齐方式 | `'right'` |
| actions | 底部操作 | `['cancel', 'ok']` |
| cancelProps | 取消按钮的属性 | - |
| okProps | 确认按钮的属性 | - |
| onCancelClick | 点击取消按钮时的回调函数 | - |
| onOkClick | 点击确认按钮时的回调函数 | - |
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
