---
title: 锚点
---

用于跳转到页面锚点的导航组件。

## API

### AnchorRef

```tsx
interface AnchorRef {
  active: string | null;
  updateAnchor: () => void;
}
```

### AnchorItem

```tsx
interface AnchorItem {
  href: string;
  title?: React.ReactNode;
  target?: string;
  children?: AnchorItem[];
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| href | 目标锚点 ID | - |
| title | 显示的标题 | - |
| target | 链接的 `target` 属性 | - |
| children | 嵌套锚点项 | - |
<!-- prettier-ignore-end -->

### AnchorProps

```tsx
interface AnchorProps<T extends AnchorItem>
  extends BaseProps<'anchor', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLUListElement>, 'children' | 'onClick'> {
  ref?: React.Ref<AnchorRef>;
  list: T[];
  page?: RefExtra;
  distance?: number | string;
  scrollBehavior?: 'instant' | 'smooth';
  indicator?: React.ReactNode | typeof DOT_INDICATOR | typeof LINE_INDICATOR;
  onClick?: (href: string, origin: T) => void;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| ref | 组件的 ref | - |
| list | 配置锚点项 | - |
| page | 滚动容器元素 | `window` |
| distance | 滚动时距离顶部的偏移量 | `0` |
| scrollBehavior | 滚动行为 | `'instant'` |
| indicator | 激活指示器的样式 | `DOT_INDICATOR` |
| onClick | 点击锚点时的回调函数 | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  anchor: '^anchor',
  anchor__link: '^anchor__link',
  'anchor__link.is-active': 'is-active',
  'anchor__indicator-track': '^anchor__indicator-track',
  'anchor__indicator-wrapper': '^anchor__indicator-wrapper',
  'anchor__dot-indicator': '^anchor__dot-indicator',
  'anchor__line-indicator': '^anchor__line-indicator',
};
```
