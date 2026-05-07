---
title: 悬浮按钮
---

屏幕上的主要操作的浮动按钮。

## API

### FabProps

```tsx
interface FabProps extends BaseProps<'fab', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: React.ReactNode;
  expand?: boolean;
  defaultExpand?: boolean;
  list?: { placement: 'top' | 'right' | 'bottom' | 'left'; actions: (React.ReactNode | { id: React.Key; action: React.ReactNode })[] }[];
  onExpandChange?: (expand: boolean) => void;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| children | 触发按钮 | - |
| expand | 操作列表是否展开 | - |
| defaultExpand | 默认展开状态 | `false` |
| list | 按位置分组的行动作列表 | - |
| onExpandChange | 展开状态改变时的回调函数 | - |
<!-- prettier-ignore-end -->

### FabButtonProps

```tsx
interface FabButtonProps extends BaseProps<'fab-button', typeof BUTTON_CLASSES>, React.ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: React.Ref<HTMLButtonElement>;
  pattern?: 'primary' | 'secondary' | 'outline' | 'dashed' | 'text' | 'link';
  theme?: 'primary' | 'success' | 'warning' | 'danger';
  loading?: boolean;
  shape?: 'circle' | 'round';
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| ref | 按钮元素的 ref | - |
| pattern | 按钮形态 | `'primary'` |
| theme | 颜色主题 | `'primary'` |
| loading | 为 `true` 时，显示加载状态 | `false` |
| shape | 按钮的形状 | - |
<!-- prettier-ignore-end -->

### FabBacktopProps

```tsx
interface FabBacktopProps extends FabButtonProps {
  page?: RefExtra;
  distance?: number | string;
  scrollBehavior?: 'instant' | 'smooth';
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| page | 可滚动的页面元素 | - |
| distance | 显示返回顶部按钮的距离 | `400` |
| scrollBehavior | 滚动行为 | `'instant'` |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  fab: '^fab',
  fab__actions: '^fab__actions',
  'fab__actions--top': '^fab__actions--top',
  'fab__actions--right': '^fab__actions--right',
  'fab__actions--bottom': '^fab__actions--bottom',
  'fab__actions--left': '^fab__actions--left',
};

const BUTTON_CLASSES = {
  'fab-button': '^fab-button',
  'fab-button.t-primary': 't-primary',
  'fab-button.t-success': 't-success',
  'fab-button.t-warning': 't-warning',
  'fab-button.t-danger': 't-danger',
  'fab-button.is-expand': 'is-expand',
  'fab-button.is-loading': 'is-loading',
  'fab-button--in-actions': '^fab-button--in-actions',
  'fab-button--primary': '^fab-button--primary',
  'fab-button--secondary': '^fab-button--secondary',
  'fab-button--outline': '^fab-button--outline',
  'fab-button--dashed': '^fab-button--dashed',
  'fab-button--text': '^fab-button--text',
  'fab-button--link': '^fab-button--link',
  'fab-button--circle': '^fab-button--circle',
  'fab-button--round': '^fab-button--round',
  'fab-button__icon': '^fab-button__icon',
  'fab-button__content': '^fab-button__content',
};
```
