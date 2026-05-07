---
group: Data Display
title: Accordion
aria: accordion
---

A vertically stacked list of items that can be expanded or collapsed.

## API

### AccordionItem

```tsx
interface AccordionItem<ID extends React.Key> {
  id: ID;
  title: React.ReactNode;
  region: React.ReactNode;
  arrow?: boolean | 'left';
  disabled?: boolean;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| id | Unique identifier | - |
| title | The title of the item | - |
| region | The content of the item | - |
| arrow | Whether to show the arrow and its position | - |
| disabled | If `true`, disable the item | `false` |
<!-- prettier-ignore-end -->

### AccordionProps

```tsx
interface AccordionProps<ID extends React.Key, T extends AccordionItem<ID>>
  extends BaseProps<'accordion', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  list: T[];
  active?: ID | null | ID[];
  defaultActive?: ID | null | ID[];
  activeOne?: boolean;
  arrow?: 'left' | 'right' | false;
  lazyLoading?: boolean;
  onActiveChange?: (id: any, origin: any) => void;
  afterActiveChange?: (id: ID, origin: T, active: boolean) => void;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| list | Configure items | - |
| active | The active item(s) | - |
| defaultActive | The default active item(s) | `activeOne ? null : []` |
| activeOne | If `true`, only one item can be active at a time | `false` |
| arrow | The default arrow position | `'right'` |
| lazyLoading | If `true`, lazy render the region content | `true` |
| onActiveChange | Callback fired when the active item changes | - |
| afterActiveChange | Callback fired after the active state animation completes | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  accordion: '^accordion',
  accordion__item: '^accordion__item',
  'accordion__item-button': '^accordion__item-button',
  'accordion__item-button.is-disabled': 'is-disabled',
  'accordion__item-button--arrow-left': '^accordion__item-button--arrow-left',
  'accordion__item-title': '^accordion__item-title',
  'accordion__item-arrow': '^accordion__item-arrow',
  'accordion__item-region': '^accordion__item-region',
};
```
