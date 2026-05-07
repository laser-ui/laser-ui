---
group: Navigation
title: Menu
aria: menu!
---

A navigation menu for organizing and displaying hierarchical content.

## API

### MenuItem

```tsx
interface MenuItem<ID extends React.Key> {
  id: ID;
  title: React.ReactNode;
  type: 'item' | 'group' | 'sub';
  icon?: React.ReactNode;
  disabled?: boolean;
  children?: MenuItem<ID>[];
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| id | Unique identifier | - |
| title | The display title | - |
| type | The item type | - |
| icon | The icon element | - |
| disabled | If `true`, disable the item | `false` |
| children | Child menu items | - |
<!-- prettier-ignore-end -->

### MenuProps

```tsx
interface MenuProps<ID extends React.Key, T extends MenuItem<ID>> extends BaseProps<'menu' | 'menu-popup', typeof CLASSES>, Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  ref?: React.Ref<MenuRef>;
  list: T[];
  mode?: MenuMode;
  width?: string | number;
  active?: ID | null;
  defaultActive?: ID;
  expands?: ID[];
  defaultExpands?: ID[];
  expandOne?: boolean;
  expandTrigger?: 'hover' | 'click';
  escClosable?: boolean;
  onActiveChange?: (id: ID, origin: T) => void;
  onExpandsChange?: (ids: ID[], origins: T[]) => void;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| ref | Ref for the component | - |
| list | The menu data | - |
| mode | The menu mode | `'vertical'` |
| width | The menu width | `'auto'` |
| active | The active item | `null` |
| defaultActive | The default active item | `null` |
| expands | The expanded items | `[]` |
| defaultExpands | The default expanded items | `[]` |
| expandOne | If `true`, only one item can be expanded at a time | `false` |
| expandTrigger | The trigger for expanding sub menus | `'click'` for vertical, `'hover'` for others |
| escClosable | If `true`, close popup menus on Escape key | `true` |
| onActiveChange | Callback fired when the active item changes | - |
| onExpandsChange | Callback fired when the expanded items change | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  menu: '^menu',
  'menu--horizontal': '^menu--horizontal',
  menu__item: '^menu__item',
  'menu__item--item': '^menu__item--item',
  'menu__item--sub': '^menu__item--sub',
  'menu__item--horizontal': '^menu__item--horizontal',
  'menu__item--icon': '^menu__item--icon',
  'menu__item.is-active': 'is-active',
  'menu__item.is-expand': 'is-expand',
  'menu__item.is-disabled': 'is-disabled',
  'menu__item-icon': '^menu__item-icon',
  'menu__item-content': '^menu__item-content',
  'menu__group-list': '^menu__group-list',
  'menu__group-title': '^menu__group-title',
  'menu__sub-list': '^menu__sub-list',
  'menu__sub-arrow': '^menu__sub-arrow',
  'menu__sub-arrow--horizontal': '^menu__sub-arrow--horizontal',
  'menu__sub-arrow.is-expand': 'is-expand',
  menu__indicator: '^menu__indicator',
  'menu__indicator--first': '^menu__indicator--first',
  'menu__indicator--last': '^menu__indicator--last',
  'menu__indicator-track': '^menu__indicator-track',
  'menu__indicator-track--hidden': '^menu__indicator-track--hidden',
  'menu__indicator-thumb': '^menu__indicator-thumb',
  menu__empty: '^menu__empty',
  'menu-popup': '^menu-popup',
};
```
