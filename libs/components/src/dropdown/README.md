---
group: Navigation
title: Dropdown
aria: menubutton!
---

For displaying a list of options that can be triggered by a button.

## API

### DropdownProps

```tsx
interface DropdownItem<ID extends React.Key> {
  id: ID;
  title: React.ReactNode;
  type: 'item' | 'group' | 'sub';
  icon?: React.ReactNode;
  theme?: 'primary' | 'success' | 'warning' | 'danger';
  disabled?: boolean;
  separator?: boolean;
  children?: DropdownItem<ID>[];
}

interface DropdownProps<ID extends React.Key, T extends DropdownItem<ID>>
  extends BaseProps<'dropdown' | 'dropdown-popup', typeof CLASSES>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onClick'> {
  ref?: React.Ref<DropdownRef>;
  children: (props: {
    id: string;
    tabIndex: number;
    'aria-haspopup': 'menu';
    'aria-expanded': boolean;
    'aria-controls': string;
    onClick: React.MouseEventHandler<HTMLElement>;
    onMouseEnter: React.MouseEventHandler<HTMLElement>;
    onMouseLeave: React.MouseEventHandler<HTMLElement>;
    onFocus: React.FocusEventHandler<HTMLElement>;
    onBlur: React.FocusEventHandler<HTMLElement>;
    onKeyDown: React.KeyboardEventHandler<HTMLElement>;
  }) => React.ReactNode;
  list: T[];
  visible?: boolean;
  defaultVisible?: boolean;
  trigger?: 'hover' | 'click';
  placement?: VerticalSidePlacement;
  placementFixed?: boolean;
  arrow?: boolean;
  virtual?: boolean | number;
  escClosable?: boolean;
  zIndex?: number | string;
  popupRender?: (el: React.ReactElement) => React.ReactNode;
  onVisibleChange?: (visible: boolean) => void;
  afterVisibleChange?: (visible: boolean) => void;
  onClick?: (id: ID, origin: T) => void | false;
}
```

<!-- prettier-ignore-start -->
| Property | Description | Default |
| --- | --- | --- |
| ref | Ref for the component | - |
| children | The trigger element render function | - |
| list | The dropdown options | - |
| visible | Whether the dropdown is visible | - |
| defaultVisible | The default visibility of the dropdown | `false` |
| trigger | The trigger mode | `'hover'` |
| placement | The placement of the dropdown | `'bottom-right'` |
| placementFixed | If `true`, the placement is fixed | `false` |
| arrow | If `true`, show the arrow | `false` |
| virtual | If `true`, enable virtual scrolling, or set the item height | `false` |
| escClosable | If `true`, close the dropdown on Escape key | `true` |
| zIndex | The z-index of the dropdown | - |
| popupRender | Custom render function for the popup | - |
| onVisibleChange | Callback fired when the visibility changes | - |
| afterVisibleChange | Callback fired after the visibility changes | - |
| onClick | Callback fired when an item is clicked | - |
<!-- prettier-ignore-end -->

### CSS

```tsx
const CLASSES = {
  dropdown: '^dropdown',
  'dropdown--top': '^dropdown--top',
  'dropdown--top-left': '^dropdown--top-left',
  'dropdown--top-right': '^dropdown--top-right',
  'dropdown--bottom': '^dropdown--bottom',
  'dropdown--bottom-left': '^dropdown--bottom-left',
  'dropdown--bottom-right': '^dropdown--bottom-right',
  dropdown__item: '^dropdown__item',
  'dropdown__item.t-primary': 't-primary',
  'dropdown__item.t-success': 't-success',
  'dropdown__item.t-warning': 't-warning',
  'dropdown__item.t-danger': 't-danger',
  'dropdown__item--item': '^dropdown__item--item',
  'dropdown__item--sub': '^dropdown__item--sub',
  'dropdown__item.is-expand': 'is-expand',
  'dropdown__item.is-disabled': 'is-disabled',
  'dropdown__item-icon': '^dropdown__item-icon',
  'dropdown__item-content': '^dropdown__item-content',
  'dropdown__group-list': '^dropdown__group-list',
  'dropdown__group-title': '^dropdown__group-title',
  'dropdown__group-title.t-primary': 't-primary',
  'dropdown__group-title.t-success': 't-success',
  'dropdown__group-title.t-warning': 't-warning',
  'dropdown__group-title.t-danger': 't-danger',
  'dropdown__sub-arrow': '^dropdown__sub-arrow',
  dropdown__list: '^dropdown__list',
  dropdown__empty: '^dropdown__empty',
  dropdown__arrow: '^dropdown__arrow',
  'dropdown-popup': '^dropdown-popup',
};
```
