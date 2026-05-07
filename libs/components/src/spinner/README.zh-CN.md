---
title: 加载指示器
---

用于展示操作状态的加载指示器。

## API

### SpinnerProps

```tsx
interface SpinnerProps extends BaseProps<'spinner', typeof CLASSES>, React.HTMLAttributes<HTMLElement> {
  visible: boolean;
  text?: React.ReactNode;
  size?: number | string;
  delay?: number;
  alone?: boolean;
  afterVisibleChange?: (visible: boolean) => void;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| visible | 为 `true` 时，加载器可见 | - |
| text | 显示的文字 | - |
| size | 加载图标的大小 | `28` |
| delay | 延迟显示的毫秒数 | - |
| alone | 为 `true` 时，根据正常文档流定位 | `false` |
| afterVisibleChange | 可见性改变后的回调函数 | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  spinner: '^spinner',
  'spinner--alone': '^spinner--alone',
  spinner__container: '^spinner__container',
  spinner__icon: '^spinner__icon',
  spinner__text: '^spinner__text',
};
```
