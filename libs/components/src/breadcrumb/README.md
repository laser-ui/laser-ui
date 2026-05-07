---
group: Navigation
title: Breadcrumb
aria: breadcrumb
---

A navigation aid showing the user's location in a hierarchy.

## API

### BreadcrumbItem

```tsx
interface BreadcrumbItem<ID extends React.Key> {
  id: ID;
  title: React.ReactNode;
  link?: boolean;
  separator?: React.ReactNode;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| id | Unique identifier | - |
| title | The display title | - |
| link | If `true`, show as a link | - |
| separator | Custom separator for this item | - |
<!-- prettier-ignore-end -->

### BreadcrumbProps

```tsx
interface BreadcrumbProps<ID extends React.Key, T extends BreadcrumbItem<ID>>
  extends BaseProps<'breadcrumb', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'onClick'> {
  list: T[];
  separator?: React.ReactNode;
  onClick?: (id: ID, origin: T) => void;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| list | Configure breadcrumb items | - |
| separator | The default separator | `'/'` |
| onClick | Callback fired when an item is clicked | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  breadcrumb: '^breadcrumb',
  breadcrumb__list: '^breadcrumb__list',
  breadcrumb__item: '^breadcrumb__item',
  'breadcrumb__item--link': '^breadcrumb__item--link',
  'breadcrumb__item--last': '^breadcrumb__item--last',
  breadcrumb__separator: '^breadcrumb__separator',
};
```
