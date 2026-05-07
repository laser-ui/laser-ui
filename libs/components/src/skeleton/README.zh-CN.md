---
title: 骨架屏
---

用于展示加载状态的占位组件。

## API

### SkeletonProps

```tsx
interface SkeletonProps extends BaseProps<'skeleton', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  pattern?: 'text' | 'circular' | 'rect';
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| pattern | 骨架屏形态 | `'text'` |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  skeleton: '^skeleton',
  'skeleton--text': '^skeleton--text',
  'skeleton--circular': '^skeleton--circular',
  'skeleton--rect': '^skeleton--rect',
};
```
