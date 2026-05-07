---
title: 抽屉
---

从屏幕边缘滑出的面板。

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
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| visible | 抽屉是否可见 | - |
| header | 头部内容 | - |
| footer | 底部内容 | - |
| placement | 抽屉的位置 | `'right'` |
| width | 抽屉的宽度 | `400` |
| height | 抽屉的高度 | `280` |
| mask | 为 `true` 时，显示遮罩 | `true` |
| maskClosable | 为 `true` 时，点击遮罩关闭抽屉 | `true` |
| escClosable | 为 `true` 时，按 Esc 键关闭抽屉 | `true` |
| container | 容器元素 | `document.body` |
| skipFirstTransition | 为 `true` 时，跳过第一次过渡动画 | `true` |
| destroyAfterClose | 为 `true` 时，关闭后销毁内容 | `false` |
| lazyLoading | 为 `true` 时，懒加载内容 | `true` |
| zIndex | 抽屉的 z-index | - |
| onClose | 抽屉关闭时的回调函数 | - |
| afterVisibleChange | 可见性改变后的回调函数 | - |
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
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| actions | 头部的操作 | `['close']` |
| closeProps | 关闭按钮的属性 | - |
| onCloseClick | 点击关闭按钮时的回调函数 | - |
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
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| align | 底部操作的对齐方式 | `'right'` |
| actions | 底部的操作 | `['cancel', 'ok']` |
| cancelProps | 取消按钮的属性 | - |
| okProps | 确认按钮的属性 | - |
| onCancelClick | 点击取消按钮时的回调函数 | - |
| onOkClick | 点击确认按钮时的回调函数 | - |
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
