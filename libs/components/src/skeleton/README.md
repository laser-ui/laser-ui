---
group: Feedback
title: Skeleton
---

A placeholder component for displaying loading states.

## API

### SkeletonProps

```tsx
interface SkeletonProps extends BaseProps<'skeleton', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  pattern?: 'text' | 'circular' | 'rect';
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| pattern | The pattern of the skeleton | `'text'` |
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
