---
title: 对话框
---

用于展示重要内容或收集用户输入的对话框。

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
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| visible | 是否可见 | - |
| header | 头部内容 | - |
| footer | 底部内容 | - |
| alert | 警告内容 | - |
| width | 模态框宽度 | `520` |
| top | 距离顶部的距离，或 `'center'` 垂直居中 | `100` |
| mask | 为 `true` 时，显示遮罩 | `true` |
| maskClosable | 为 `true` 时，点击遮罩关闭模态框 | `true` |
| escClosable | 为 `true` 时，按 Esc 键关闭模态框 | `true` |
| skipFirstTransition | 为 `true` 时，跳过首次过渡动画 | `true` |
| destroyAfterClose | 为 `true` 时，关闭后销毁内容 | `false` |
| lazyLoading | 为 `true` 时，懒加载内容 | `true` |
| zIndex | 模态框的 z-index | - |
| onClose | 关闭时的回调函数 | - |
| afterVisibleChange | 可见性改变后的回调函数 | - |
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
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| actions | 头部操作 | `['close']` |
| closeProps | 关闭按钮的属性 | - |
| onCloseClick | 点击关闭按钮时的回调函数 | - |
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
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| align | 底部对齐方式 | `'right'` |
| actions | 底部操作 | `['cancel', 'ok']` |
| cancelProps | 取消按钮的属性 | - |
| okProps | 确认按钮的属性 | - |
| onCancelClick | 点击取消按钮时的回调函数 | - |
| onOkClick | 点击确认按钮时的回调函数 | - |
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
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| type | 警告类型 | - |
| title | 警告标题 | - |
| icon | 警告图标 | - |
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
