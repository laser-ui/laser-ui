---
group: Layout
title: Affix
---

Wrap a component to make it stick to the viewport when scrolling.

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
| Property | Description | Default |
| --- | --- | --- |
| ref | Ref for the component | - |
| children | Render function | - |
| top | Offset from the top of the viewport | `0` |
| target | The scroll target element | `window` |
| zIndex | The z-index of the affixed element | - |
<!-- prettier-ignore-end -->
