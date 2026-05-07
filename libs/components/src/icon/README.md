---
group: General
title: Icon
---

A wrapper for the `svg` icon.

The icons of the component library use `outlined` icons under the `@material-design-icons/svg` library, it is recommended that you keep consistent when developing your application.

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
| Property | Description | Default |
| --- | --- | --- |
| children | The SVG icon element | - |
| size | The size of the icon, or `[width, height]` | `'1em'` |
| theme | The color theme | - |
| rotate | The rotation angle in degrees | - |
| spin | If `true`, the icon spins continuously | `false` |
| spinSpeed | The speed of the spin animation | `1` |
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
