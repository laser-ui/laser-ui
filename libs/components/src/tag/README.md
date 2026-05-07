---
group: Data Display
title: Tag
---

A tag component for categorizing or marking items.

## API

### TagProps

```tsx
interface TagProps extends BaseProps<'tag', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  pattern?: 'primary' | 'fill' | 'outline';
  theme?: 'primary' | 'success' | 'warning' | 'danger';
  size?: Size;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| pattern | The pattern of the tag | `'primary'` |
| theme | The theme color | - |
| size | Size | `medium` |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  tag: '^tag',
  'tag.t-primary': 't-primary',
  'tag.t-success': 't-success',
  'tag.t-warning': 't-warning',
  'tag.t-danger': 't-danger',
  'tag--primary': '^tag--primary',
  'tag--fill': '^tag--fill',
  'tag--outline': '^tag--outline',
  'tag--small': '^tag--small',
  'tag--medium': '^tag--medium',
  'tag--large': '^tag--large',
};
```
