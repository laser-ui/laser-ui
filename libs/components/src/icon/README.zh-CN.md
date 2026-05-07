---
title: 图标
---

`svg` 图标的包装器。

组件库的图标使用 `@material-design-icons/svg` 库下的 `outlined` 图标，建议您在开发应用时保持一致。

## API

### IconProps

```tsx
interface IconProps extends BaseProps<'icon', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children: React.FunctionComponentElement<React.SVGProps<SVGSVGElement>>;
  size?: number | string | [number | string, number | string];
  theme?: 'primary' | 'success' | 'warning' | 'danger';
  rotate?: number;
  spin?: boolean;
  spinSpeed?: number | string;
}
```

<!-- prettier-ignore-start -->
| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| children | SVG 图标元素 | - |
| size | 图标的大小，或 `[width, height]` | `'1em'` |
| theme | 颜色主题 | - |
| rotate | 旋转角度（度） | - |
| spin | 为 `true` 时，图标持续旋转 | `false` |
| spinSpeed | 旋转动画的速度 | `1` |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  icon: '^icon',
  'icon.t-primary': 't-primary',
  'icon.t-success': 't-success',
  'icon.t-warning': 't-warning',
  'icon.t-danger': 't-danger',
};
```
