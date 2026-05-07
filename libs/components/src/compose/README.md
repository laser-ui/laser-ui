---
group: General
title: Compose
---

For combining multiple components into a single group.

## API

### ComposeProps

```tsx
interface ComposeProps extends BaseProps<'compose', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  size?: Size;
  vertical?: boolean;
  disabled?: boolean;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| size | Size | `medium` |
| vertical | If `true`, the compose is vertical | `false` |
| disabled | If `true`, disable the component | `false` |
<!-- prettier-ignore-end -->

### ComposeItemProps

```tsx
interface ComposeItemProps extends BaseProps<'compose', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  gray?: boolean;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| gray | If `true`, the item has a gray background | `false` |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  compose: '^compose',
  'compose--vertical': '^compose--vertical',
  compose__item: '^compose__item',
  'compose__item--gray': '^compose__item--gray',
  'compose__item--small': '^compose__item--small',
  'compose__item--medium': '^compose__item--medium',
  'compose__item--large': '^compose__item--large',
  'compose__item.is-disabled': 'is-disabled',
};
```
