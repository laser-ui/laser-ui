---
title: 固钉
---

将组件包裹在 Affix 中，使其在滚动时固定在视口中。

## API

### AffixRef

```tsx
interface AffixRef {
  sticky: boolean;
  updatePosition: () => void;
}
```

### AffixProps

```tsx
interface AffixProps {
  ref?: React.Ref<AffixRef>;
  children: (props: {
    style?: React.CSSProperties;
    'aria-hidden'?: true;
    'data-l-affix-placeholder'?: string;
    'data-l-affix'?: string;
  }) => React.ReactElement | null;
  top?: number | string;
  target?: RefExtra;
  zIndex?: number | string;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| ref | 组件的 ref | - |
| children | 渲染函数 | - |
| top | 距离视口顶部的偏移量 | `0` |
| target | 滚动目标元素 | `window` |
| zIndex | 固定元素的 z-index | - |
<!-- prettier-ignore-end -->
