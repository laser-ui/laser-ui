---
title: 徽标
---

用于显示数字或状态的小型标记。

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
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| value | 显示的值 | - |
| theme | 主题色 | `'danger'` |
| max | 最大值，超过显示 `max+` | `Infinity` |
| dot | 为 `true` 时，显示为圆点 | `false` |
| showZero | 为 `true` 时，值为 0 也显示 | `false` |
| offset | 距离左上角的偏移量 | `[0, '100%']` |
| alone | 为 `true` 时，作为独立徽标显示 | `false` |
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
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| text | 显示的文本 | - |
| theme | 主题色 | `'danger'` |
| offset | 距离左上角的偏移量 | `[0, '100%']` |
| alone | 为 `true` 时，作为独立徽标显示 | `false` |
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
