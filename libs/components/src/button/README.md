---
group: General
title: Button
aria: button
compose: true
---

A clickable button component.

## API

### ButtonProps

```tsx
interface ButtonProps extends BaseProps<'button', typeof CLASSES>, React.ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: React.Ref<HTMLButtonElement>;
  pattern?: 'primary' | 'secondary' | 'outline' | 'dashed' | 'text' | 'link';
  theme?: 'primary' | 'success' | 'warning' | 'danger';
  loading?: boolean;
  shape?: 'circle' | 'round';
  block?: boolean;
  size?: Size;
  icon?: React.ReactNode;
  iconRight?: boolean;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| ref | Ref for the button element | - |
| pattern | The pattern of the button | `'primary'` |
| theme | The theme color | `'primary'` |
| loading | If `true`, show loading state | `false` |
| shape | The shape of the button | - |
| block | If `true`, the button takes full width | `false` |
| size | The size of the button | - |
| icon | The icon of the button | - |
| iconRight | If `true`, place the icon on the right | `false` |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  button: '^button',
  'button.t-primary': 't-primary',
  'button.t-success': 't-success',
  'button.t-warning': 't-warning',
  'button.t-danger': 't-danger',
  'button.is-loading': 'is-loading',
  'button--primary': '^button--primary',
  'button--secondary': '^button--secondary',
  'button--outline': '^button--outline',
  'button--dashed': '^button--dashed',
  'button--text': '^button--text',
  'button--link': '^button--link',
  'button--circle': '^button--circle',
  'button--round': '^button--round',
  'button--block': '^button--block',
  'button--small': '^button--small',
  'button--medium': '^button--medium',
  'button--large': '^button--large',
  'button--icon': '^button--icon',
  'button--icon-right': '^button--icon-right',
  button__icon: '^button__icon',
};
```
