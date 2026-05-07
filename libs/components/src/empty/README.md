---
group: Data Display
title: Empty
---

Placeholder when there is no data.

## API

### EmptyProps

```tsx
interface EmptyProps extends BaseProps<'empty', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  image?: React.ReactNode | typeof SIMPLE_IMG;
  description?: React.ReactNode;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| image | The image to display, or use `Empty.SIMPLE_IMG` for a simple image | default SVG |
| description | The description text | `'No data'` |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  empty: '^empty',
  empty__img: '^empty__img',
  empty__description: '^empty__description',
  empty__footer: '^empty__footer',
};
```
