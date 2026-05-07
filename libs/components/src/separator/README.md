---
group: Layout
title: Separator
---

A divider line that separates content.

## API

### SeparatorProps

```tsx
interface SeparatorProps extends BaseProps<'separator', typeof CLASSES>, React.HTMLAttributes<HTMLElement> {
  textAlign?: 'left' | 'right' | 'center';
  vertical?: boolean;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| textAlign | The alignment of the text | `'left'` |
| vertical | If `true`, display as a vertical line | `false` |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  separator: '^separator',
  'separator--text': '^separator--text',
  'separator--text-left': '^separator--text-left',
  'separator--text-right': '^separator--text-right',
  'separator--text-center': '^separator--text-center',
  'separator--vertical': '^separator--vertical',
  separator__text: '^separator__text',
};
```
