---
group: Data Display
title: Card
---

A container for grouping related content.

## API

### CardProps

```tsx
interface CardProps extends BaseProps<'card', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  shadow?: boolean | 'hover';
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| shadow | If `true` or `'hover'`, show shadow effect | `false` |
<!-- prettier-ignore-end -->

### CardHeaderProps

```tsx
interface CardHeaderProps extends BaseProps<'card', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  action?: React.ReactNode;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| action | The action element of the header | - |
<!-- prettier-ignore-end -->

### CardContentProps

```tsx
interface CardContentProps extends BaseProps<'card', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {}
```

### CardActionsProps

```tsx
interface CardActionsProps extends BaseProps<'card', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  actions: (React.ReactNode | { id: React.Key; action: React.ReactNode })[];
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| actions | The actions to display | - |
<!-- prettier-ignore-end -->

### CardActionProps

```tsx
interface CardActionProps extends BaseProps<'card', typeof CLASSES>, React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  disabled?: boolean;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| ref | Ref for the element | - |
| disabled | If `true`, disable the action | `false` |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  card: '^card',
  'card--shadow': '^card--shadow',
  'card--shadow-hover': '^card--shadow-hover',
  card__header: '^card__header',
  'card__header-title': '^card__header-title',
  'card__header-action': '^card__header-action',
  card__content: '^card__content',
  card__actions: '^card__actions',
  card__action: '^card__action',
  'card__action.is-disabled': 'is-disabled',
};
```
