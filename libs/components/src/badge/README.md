---
group: Data Display
title: Badge
---

A small numeric or status indicator.

## API

### BadgeProps

```tsx
interface BadgeProps extends BaseProps<'badge', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  value: number;
  theme?: 'primary' | 'success' | 'warning' | 'danger';
  max?: number;
  dot?: boolean;
  showZero?: boolean;
  offset?: [number | string, number | string];
  alone?: boolean;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| value | The value to display | - |
| theme | The theme color | `'danger'` |
| max | The maximum value to display, exceeding shows `max+` | `Infinity` |
| dot | If `true`, display as a dot | `false` |
| showZero | If `true`, show badge when value is 0 | `false` |
| offset | Offset from the top-left corner | `[0, '100%']` |
| alone | If `true`, display as a standalone badge | `false` |
<!-- prettier-ignore-end -->

### BadgeTextProps

```tsx
interface BadgeTextProps extends BaseProps<'badge', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  text: string;
  theme?: 'primary' | 'success' | 'warning' | 'danger';
  offset?: [number | string, number | string];
  alone?: boolean;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| text | The text to display | - |
| theme | The theme color | `'danger'` |
| offset | Offset from the top-left corner | `[0, '100%']` |
| alone | If `true`, display as a standalone badge | `false` |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  badge: '^badge',
  'badge.t-primary': 't-primary',
  'badge.t-success': 't-success',
  'badge.t-warning': 't-warning',
  'badge.t-danger': 't-danger',
  'badge--dot': '^badge--dot',
  'badge--alone': '^badge--alone',
  badge__wrapper: '^badge__wrapper',
  'badge__number-container': '^badge__number-container',
  badge__number: '^badge__number',
};
```
